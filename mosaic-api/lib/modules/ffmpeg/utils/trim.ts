////////////////////////////////////////
// TRIM, SCALE, CROP, SETPTS, FADE IN, FADE OUT
/////////////
const allCropFiltersObj = 
  {
    2: '540:1080:270:0',
    3: '360:1080:360:0',
    4: '1080:1080:0:0',
    6: '720:1080:180:0',
    9: '1080:1080:0:0',
  }
const allScaleFiltersObj = 
{
  2: '',
  3: '',
  4: ', scale=540:540',
  6: ', scale=360:540',
  9: ', scale=360:360'
}

module.exports.createTrimFilter = function (panelCount, trimInterval, preCropStr) {

  const cropFilterStr = allCropFiltersObj[panelCount];
  const scaleFilterStr = allScaleFiltersObj[panelCount];
  let trimFilterStr = '';//`[0:v] crop=1080:1080:0:420 [00];\n`;
  let i = 0;

  for (; i < panelCount; i++) {
    //trimFilterStr += `[0:v] scale=1080x1080, trim=start=${trimInterval * i}:duration=2, crop=${cropFilterStr}, setpts=PTS-STARTPTS, fade=type=in:start_time=0:duration=0.5:alpha=1, fade=type=out:start_time=1.5:duration=0.45:alpha=1${scaleFilterStr} [trim.${i}];\n`;
    trimFilterStr += `[0:v] ${preCropStr} trim=start=${trimInterval * i}:duration=2, crop=${cropFilterStr}, setpts=PTS-STARTPTS, fade=type=in:start_time=0:duration=0.5:alpha=1, fade=type=out:start_time=1.5:duration=0.45:alpha=1${scaleFilterStr} [trim.${i}];\n`;
  }     

  return trimFilterStr;
}