const { createPtsFilter } = require('./pts');
const { createTrimFilter } = require('./trim');
const { createOverlayFilter } = require('./overlay');

module.exports.createFfmpegFilterComplexStr = function ({
  panelCount,
  sequenceCount,
  fadeInToOutDuration,
  inputDuration,
  outputDuration,
  outputSize,
  bgFrameStart,
  bgFrameHue,
  preCropStr
}) {
  let ffmpegFilterComplexStr = '';


  //preCropStr = 'crop=1080:1080:0:420, ';

  /////////////////////////////
  // CREATE BASE AND BG
  //  ffmpegFilterComplexStr += `nullsrc=size=${outputSize}:duration=${outputDuration} [base];\n`;
  ffmpegFilterComplexStr += `nullsrc=size=${outputSize}:duration=${outputDuration} [base];\n`;
  //ffmpegFilterComplexStr += `[0:v] scale=${outputScale}, trim=start=${bgFrameStart}:duration=0.05, setpts=PTS-STARTPTS${bgFrameHue} [bg_frame];\n`;
  ffmpegFilterComplexStr += `[0:v] ${preCropStr}trim=start=${bgFrameStart}:duration=0.05, setpts=PTS-STARTPTS${bgFrameHue} [bg_frame];\n`;
  ffmpegFilterComplexStr += `[base][bg_frame] overlay [bg];\n`;


  ////////////////////////////////////////
  // TRIM, SCALE, CROP, SETPTS, FADE IN, FADE OUT
  const trimInterval = (inputDuration - fadeInToOutDuration) / (panelCount - 1);
  ffmpegFilterComplexStr += createTrimFilter(panelCount, trimInterval, preCropStr);

  /////////////////////////////////////////
  // SPLIT
  let panelCounter = 0;
  let copyCount = sequenceCount;
  let splitFilterStr = '';
  for (; panelCounter < panelCount; panelCounter++) {
    splitFilterStr += `[trim.${panelCounter}] split=${copyCount} `;
    for (let copyCounter = 0; copyCounter < copyCount; copyCounter++) {
      splitFilterStr += `[split.${panelCounter}.${copyCounter}]`;
    }
    splitFilterStr += ';\n';
  }
  ffmpegFilterComplexStr += splitFilterStr;


  ////////////////////////////////////////////////////////
  // PRESENTATION TIMESTAMP
  ffmpegFilterComplexStr += createPtsFilter(panelCount);


  ////////////////////////
  // OVERLAY
  ffmpegFilterComplexStr += createOverlayFilter(panelCount, sequenceCount);

  return ffmpegFilterComplexStr;
}
