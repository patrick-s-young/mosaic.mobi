import { CROP_DIMENSIONS, SCALE_DIMENSIONS } from '../configs';

export default function createTrimFilter (panelCount:number, trimInterval:number, preCropStr:string):string {
  const cropFilterStr = CROP_DIMENSIONS[panelCount];
  const scaleFilterStr = SCALE_DIMENSIONS[panelCount];
  let trimFilterStr = '';
  let i = 0;
  for (; i < panelCount; i++) {
    trimFilterStr += `[0:v] ${preCropStr} trim=start=${trimInterval * (i + 1)}:duration=2, crop=${cropFilterStr}, setpts=PTS-STARTPTS, fade=type=in:start_time=0:duration=0.5:alpha=1, fade=type=out:start_time=1.5:duration=0.45:alpha=1${scaleFilterStr} [trim.${i}];\n`;
  }     
  return trimFilterStr;
}