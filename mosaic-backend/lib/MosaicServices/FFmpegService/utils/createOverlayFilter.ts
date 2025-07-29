import { OVERLAY_OFFSETS } from '../configs';

export default function createOverlayFilter (panelCount:number, sequenceCount:number):string {
  let overlayFilterStr = '[bg]';
  let panelCounter: number = 0;
  let sequenceCounter: number = 0;
  const overlayFilterArr = OVERLAY_OFFSETS[panelCount];
  for (panelCounter = 0; panelCounter < panelCount; panelCounter++) {
    for (sequenceCounter = 0; sequenceCounter < sequenceCount; sequenceCounter++) {
      overlayFilterStr += `[input.${panelCounter}.${sequenceCounter}] overlay=${overlayFilterArr[panelCounter]}`;
      overlayFilterStr += panelCounter === panelCount - 1 && sequenceCounter === sequenceCount - 1
        ? ` [final]`
        : ` [output.${panelCounter}.${sequenceCounter}];\n[output.${panelCounter}.${sequenceCounter}]`;
    }
  }
  return overlayFilterStr;
}