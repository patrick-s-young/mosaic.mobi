import { numTilesAllPossibleValues } from 'features/mosaicVideo/mosaicSlice';
import type { RectGroupCollection } from 'features/mosaicVideo/mosaicSlice';

interface GetDrawToCanvasArea {
  (videoWidth: number, videoHeight: number): RectGroupCollection
} 

export const getDrawToCanvasArea: GetDrawToCanvasArea = (videoWidth, videoHeight) => {
  // hard-coded ratios for calculating width/height of canvas area to be drawn to
  const tileSize: { [key: string] : {width: number, height: number } } = {
    2: { width: videoWidth / 2, height: videoHeight},
    3: { width: videoWidth / 3, height: videoHeight},
    4: { width: videoWidth / 2, height: videoHeight / 2 },
    6: { width: videoWidth / 3, height: videoHeight / 2 },
    9: { width: videoWidth / 3, height: videoHeight / 3 }
  }
  // calcualte x/y origin of canvas area to be drawn to
  const drawToCanvasArea: Partial<RectGroupCollection> = {};
  numTilesAllPossibleValues.forEach(numTiles => { 
    drawToCanvasArea[numTiles] = rowCol[numTiles].map(({ row, col }) => {
      return {
        x: col * tileSize[numTiles].width, 
        y: row * tileSize[numTiles].height, 
        width: tileSize[numTiles].width, 
        height: tileSize[numTiles].height       
      }});
    });
  
  return drawToCanvasArea as RectGroupCollection;
}


// hard-coded origin x/y ratios can be calculated for less verbosity
const rowCol: { [index: string] : Array<{row: number, col: number}> } = {
  2:[
      {row: 0, col: 0},
      {row: 0, col: 1}
    ],
  3:[
      {row: 0, col: 0},
      {row: 0, col: 1},
      {row: 0, col: 2}
    ],
  4:[
      {row: 0, col: 0},
      {row: 0, col: 1},
      {row: 1, col: 0},
      {row: 1, col: 1}
    ],
  6:[
      {row: 0, col: 0},
      {row: 0, col: 1},
      {row: 0, col: 2},
      {row: 1, col: 0},
      {row: 1, col: 1},
      {row: 1, col: 2}
    ],
  9:[
      {row: 0, col: 0},
      {row: 0, col: 1},
      {row: 0, col: 2},
      {row: 1, col: 0},
      {row: 1, col: 1},
      {row: 1, col: 2},
      {row: 2, col: 0},
      {row: 2, col: 1},
      {row: 2, col: 2}
    ]
}