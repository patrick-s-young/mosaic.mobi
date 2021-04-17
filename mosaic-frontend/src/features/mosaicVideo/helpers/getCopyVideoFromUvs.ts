import type { UvsCollection } from 'features/mosaicVideo/mosaicSlice';

export interface GetCopyVideoFromUvs {
  (): UvsCollection
} 
// grab the center of the video using the width/height ratio of the mosiaic tile. 
export const getCopyVideoFromUvs: GetCopyVideoFromUvs = () => {
  return {
    2:[
      0.25, 0, // lower left
      0.25, 1, // upper left
      0.75, 1,   // upper right
      0.75, 0], // lower right
    3:[
      0.33, 0, // lower left
      0.33, 1, // upper left
      0.66, 1,   // upper right
      0.66, 0], // lower right
    4:[
      0, 0, // lower left
      0, 1, // upper left
      1, 1,   // upper right
      1, 0], // lower right
    6: [
      0.16, 0, // lower left
      0.16, 1, // upper left
      0.84, 1,   // upper right
      0.84, 0], // lower right
    9:[
      0, 0, // lower left
      0, 1, // upper left
      1, 1,   // upper right
      1, 0] // lower right
  }
}