import { TILE_GRID } from '../configs';
import type { PanelCount } from '../../../types';

// white separator thickness as a fraction of the output width. MUST match the
// frontend GRID_LINE_RATIO (drawGridLines) so the rendered output and the
// on-device preview look identical.
const GRID_LINE_RATIO = 0.01;

// builds a comma-separated chain of drawbox filters that paint the white
// interior separator lines between tiles (a tic-tac-toe style grid for 9
// tiles). Interior lines only — no outer border. Returns '' if there are no
// interior lines to draw.
export default function createGridFilter (panelCount: number, outputWidth: number, outputHeight: number): string {
  const grid = TILE_GRID[panelCount as PanelCount];
  if (!grid) return '';
  const lineWidth = Math.max(2, Math.round(outputWidth * GRID_LINE_RATIO));
  const boxes: string[] = [];
  for (let col = 1; col < grid.cols; col++) {
    const x = Math.round((col * outputWidth) / grid.cols - lineWidth / 2);
    boxes.push(`drawbox=x=${x}:y=0:w=${lineWidth}:h=ih:color=white@1.0:t=fill`);
  }
  for (let row = 1; row < grid.rows; row++) {
    const y = Math.round((row * outputHeight) / grid.rows - lineWidth / 2);
    boxes.push(`drawbox=x=0:y=${y}:w=iw:h=${lineWidth}:color=white@1.0:t=fill`);
  }
  return boxes.join(', ');
}
