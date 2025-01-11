////////////////////////////////////////////////////////
// PRESENTATION TIMESTAMP
/////////////
const allPanelSequencesObj = 
  {
    2: 
      {
        0: [0.5, 5, 10, 12.5],
        1: [2.5, 5, 8, 12.5]
      },
    3: 
      {  
        0: [1.5, 5, 10, 12.5],
        1: [.5, 2, 9.5, 12.5],
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
        0: [2.5, 4.25, 10.5],
        1: [1.0, 7.25, 10.75],
        2: [0.5, 5.0, 10.25],
        3: [1.5, 5.5, 11.25],
        4: [1.25, 7.5, 11.5],
        5: [2, 6.25, 11.725],
        6: [1.75, 4.75, 12],
        7: [2.25, 8.25, 12.25],
        8: [2.5, 5, 12.5]
      }
  }


export const createPtsFilter = (panelCount) => {
  console.log('createPtsFilter called with panelCount: ', panelCount)
  const panelSequenceObj = allPanelSequencesObj[panelCount];
  let ptsFilterStr = '';
  console.log('panelSequenceObj',panelSequenceObj);

  for (let [panel, startTimes] of Object.entries(panelSequenceObj)) {
          // @ts-ignore: Object is possibly 'null'.
    startTimes.forEach((startTime, idx) => ptsFilterStr += `[split.${panel}.${idx}] setpts=PTS-STARTPTS+${startTime}/TB [input.${panel}.${idx}]; \n`);

  }

  console.log(`\n\nptsFilterStr=${ptsFilterStr}`);
  return ptsFilterStr;
}