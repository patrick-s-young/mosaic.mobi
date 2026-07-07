import type {
  FadeInPresentationTimestamps,
  OverlayOffsets,
  CropDimensions,
  ScaleDimensions,
  PanelCount } from '../../types';

// time offset for each panel to fade in (aspect-ratio independent)
export const FADE_IN_PRESENTATION_TIMESTAMPS: FadeInPresentationTimestamps =
  {
    2:
      {
        0: [0.5, 5, 10, 12.5],
        1: [2.5, 5, 8, 12.5]
      },
    3:
      {
        0: [1.5, 5, 10, 12.5],
        1: [.5, 6, 9.5, 12.5],
        2: [2, 5.5, 8.5, 12.5]
      },
    4:
      {
        0: [0.5, 4.0, 7.5, 12.0],
        1: [2., 5.0, 8.0, 12.0],
        2: [1.5, 4.5, 9.5, 12.0],
        3: [3.0, 5.5, 9, 12.0]
      },
    6:
      {
        0: [1.0, 8.5, 12],
        1: [0.5, 7.5, 12],
        2: [3.0, 7, 12],
        3: [2.0, 6.0, 12],
        4: [5.0, 9.5, 12],
        5: [4.0, 8.5, 12]
      },
    9:
      {
        0: [0.25, 4.25, 10.25],
        1: [1.0, 7.25, 10.5],
        2: [0.5, 5.0, 10.75],
        3: [1.5, 5.5, 11.25],
        4: [1.25, 7.5, 11.5],
        5: [2, 6.25, 11.725],
        6: [1.75, 4.75, 12],
        7: [2.25, 8.25, 12.25],
        8: [2.5, 5, 12.5]
      }
  }

// how each panel count tiles the output canvas (rows x columns)
export const TILE_GRID: { [K in PanelCount]: { rows: number; cols: number } } =
  {
    2: { rows: 1, cols: 2 },
    3: { rows: 1, cols: 3 },
    4: { rows: 2, cols: 2 },
    6: { rows: 2, cols: 3 },
    9: { rows: 3, cols: 3 }
  }

const PANEL_COUNTS: PanelCount[] = [2, 3, 4, 6, 9];

export interface TileGeometry {
  OVERLAY_OFFSETS: OverlayOffsets;
  CROP_DIMENSIONS: CropDimensions;
  SCALE_DIMENSIONS: ScaleDimensions;
}

// Derives per-panel crop / scale / overlay strings for a given output canvas
// size. The source video is pre-cropped to the same dimensions as the output
// canvas (1080x1080 for 1:1, 1080x1920 for 9:16), so each tile shows a
// centered crop of the source matching the tile's own aspect ratio, then
// scaled to the tile size. Content is therefore only ever cropped, never
// stretched, at any aspect ratio. For a 1080x1080 output this reproduces the
// original hard-coded 1:1 tables exactly.
export function getGeometry(outputWidth: number, outputHeight: number): TileGeometry {
  const OVERLAY_OFFSETS = {} as OverlayOffsets;
  const CROP_DIMENSIONS = {} as CropDimensions;
  const SCALE_DIMENSIONS = {} as ScaleDimensions;

  for (const panelCount of PANEL_COUNTS) {
    const { rows, cols } = TILE_GRID[panelCount];
    const tileW = Math.round(outputWidth / cols);
    const tileH = Math.round(outputHeight / rows);
    const tileAspect = tileW / tileH;

    // largest centered crop of the source that matches the tile's aspect ratio
    let cropW = Math.round(outputHeight * tileAspect);
    let cropH = outputHeight;
    if (cropW > outputWidth) {
      cropW = outputWidth;
      cropH = Math.round(outputWidth / tileAspect);
    }
    // encoders require even dimensions
    cropW -= cropW % 2;
    cropH -= cropH % 2;
    const cropX = Math.round((outputWidth - cropW) / 2);
    const cropY = Math.round((outputHeight - cropH) / 2);

    CROP_DIMENSIONS[panelCount] = `${cropW}:${cropH}:${cropX}:${cropY}`;
    SCALE_DIMENSIONS[panelCount] = (cropW === tileW && cropH === tileH)
      ? ''
      : `, scale=${tileW}:${tileH}`;

    const offsets: string[] = [];
    for (let i = 0; i < panelCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      offsets.push(`x=${col * tileW}:y=${row * tileH}`);
    }
    OVERLAY_OFFSETS[panelCount] = offsets;
  }

  return { OVERLAY_OFFSETS, CROP_DIMENSIONS, SCALE_DIMENSIONS };
}
