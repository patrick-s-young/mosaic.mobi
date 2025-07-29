// Presentation timestamps for fade in of each panel
export type PanelCount = 2 | 3 | 4 | 6 | 9;

export type FadeInPresentationTimestamp = {
  [sequenceIndex: number]: number[];
}

export type FadeInPresentationTimestamps = {
  [K in PanelCount]: FadeInPresentationTimestamp;
}

// x/y offsets for each video panel
export type OverlayOffsets = {
  [K in PanelCount]: string[];
}

export type CropDimensions = {
  [K in PanelCount]: string;
}

export type ScaleDimensions = {
  [K in PanelCount]: string;
}