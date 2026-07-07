import createOverlayFilter from './createOverlayFilter';
import createPtsFilter from './createPtsFilter';
import createTrimFilter from './createTrimFilter';
import { getGeometry } from '../configs';


export const createFfmpegFilterComplexStr =  ({
  panelCount,
  sequenceCount,
  fadeInToOutDuration,
  inputDuration,
  outputDuration,
  outputFps,
  outputSize,
  bgFrameHue,
  preCropStr
}) => {
  let ffmpegFilterComplexStr = '';

  // tile crop/scale/overlay geometry is derived from the output canvas size,
  // so the same filter graph works for any aspect ratio (1080x1080, 1080x1920)
  const [outputWidth, outputHeight] = outputSize.split('x').map(Number);
  const { OVERLAY_OFFSETS, CROP_DIMENSIONS, SCALE_DIMENSIONS } = getGeometry(outputWidth, outputHeight);


  /////////////////////////////
  // CREATE BASE AND BG
  ffmpegFilterComplexStr += `nullsrc=size=${outputSize}:duration=${outputDuration}:rate=${outputFps} [base];\n`;
  //ffmpegFilterComplexStr += `[0:v] ${preCropStr}trim=start=${bgFrameStart}:duration=0.05, setpts=PTS-STARTPTS${bgFrameHue} [bg_frame];\n`;
  ffmpegFilterComplexStr += `[0:v]${bgFrameHue}[bg_frame];\n`;
  ffmpegFilterComplexStr += `[base][bg_frame] overlay [bg];\n`;


  ////////////////////////////////////////
  // TRIM, SCALE, CROP, SETPTS, FADE IN, FADE OUT
  let trimInterval = (inputDuration - fadeInToOutDuration) / panelCount ;
  ffmpegFilterComplexStr += createTrimFilter(panelCount, trimInterval, preCropStr, CROP_DIMENSIONS, SCALE_DIMENSIONS);

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
  ffmpegFilterComplexStr += createOverlayFilter(panelCount, sequenceCount, OVERLAY_OFFSETS);

  return ffmpegFilterComplexStr;
}
