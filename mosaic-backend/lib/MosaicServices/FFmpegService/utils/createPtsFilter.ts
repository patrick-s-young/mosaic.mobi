import { FADE_IN_PRESENTATION_TIMESTAMPS } from '../configs';

export default function createPtsFilter (panelCount:number):string  {
  const fadeInPts = FADE_IN_PRESENTATION_TIMESTAMPS[panelCount];
  let ptsFilterStr = '';
  for (let [panel, startTimes] of Object.entries(fadeInPts)) {
    // @ts-ignore: Object is possibly 'null'.
    startTimes.forEach((startTime, idx) => ptsFilterStr += `[split.${panel}.${idx}] setpts=PTS-STARTPTS+${startTime}/TB [input.${panel}.${idx}]; \n`);
  }
  return ptsFilterStr;
}

