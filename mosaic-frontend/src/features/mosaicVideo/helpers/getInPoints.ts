import { numTilesAllPossibleValues } from 'features/mosaicVideo/mosaicSlice';
import type { TimeGroup, TimeGroupCollection } from 'features/mosaicVideo/mosaicSlice';

interface GetInPoints {
  (duration: number): TimeGroupCollection
}

export const getInPoints: GetInPoints = (duration) => {
  const inPointsCollection: Partial<TimeGroupCollection> = {};

  numTilesAllPossibleValues.forEach(numTiles => { 
    const secondsIncrement = (duration - 2.0) / numTiles;
    const inPointGroup: TimeGroup = [];
    for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
      inPointGroup.push((tileIndex + 1) * secondsIncrement);
    }
    inPointsCollection[numTiles] = inPointGroup;
  });

  return inPointsCollection as TimeGroupCollection;
}