////////////////////////////////////////////////////////
// PRESENTATION TIMESTAMP
/////////////
const allPanelSequencesObj = 
  {
    2: 
      {
        0: [0.5, 5.3, 9.8, 12.3],
        1: [2.5, 5.3, 7.8, 12.3]
      },
    3: 
      {  
        0: [1.5, 4.8, 10.1, 12.2],
        1: [0.2, 6.2, 9.4, 12.2],
        2: [2.1, 5.3, 8.5, 12.2]
      },
    4: 
      {  
        0: [0.2, 4.0, 7.6, 12.0],
        1: [2.2, 5.8, 8.0, 12.0],
        2: [1.3, 4.5, 9.3, 12.0],
        3: [3.0, 5.5, 8.7, 12.0]
      },
    6: 
      {
        0: [1.0, 8.4, 11.8],
        1: [0.2, 7.6, 11.8],
        2: [3.0, 6.9, 11.8],
        3: [2.1, 6.1, 11.8],
        4: [5.0, 9.5, 11.8],
        5: [4.1, 8.5, 11.8]
      },
    9: 
      {
        0: [0.1, 4.3, 11.6],
        1: [1.0, 7.2, 11.6],
        2: [0.5, 5.0, 11.6],
        3: [1.6, 5.6, 11.6],
        4: [1.3, 7.6, 11.6],
        5: [1.9, 6.3, 11.6],
        6: [1.8, 4.8, 11.6],
        7: [2.1, 8.3, 11.6],
        8: [2.0, 4.9, 11.6]
      }
  }


module.exports.createPtsFilter = function (panelCount) {
  const panelSequenceObj = allPanelSequencesObj[panelCount];
  let ptsFilterStr = '';
  console.log(`in pts.js : ptsFilterStr=${ptsFilterStr}`);

  for (let [panel, startTimes] of Object.entries(panelSequenceObj)) {
    startTimes.forEach((startTime, idx) => ptsFilterStr += `[split.${panel}.${idx}] setpts=PTS-STARTPTS+${startTime}/TB [input.${panel}.${idx}]; \n`);

  }

  console.log(`\n\nptsFilterStr=${ptsFilterStr}`);
  return ptsFilterStr;
}