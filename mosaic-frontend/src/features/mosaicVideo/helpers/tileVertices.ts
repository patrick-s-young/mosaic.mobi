import type { TileVertices } from 'features/mosaicVideo/mosaicSlice';

export const tileVertices: TileVertices = {
  2: [-1, -1, -1, 1, 0, 1, 0, -1],
  3: [-1, -1, -1, 1, -0.333, 1, -0.333, -1],
  4: [-1, -1, -1, 0, 0, 0, 0, -1],
  6: [-1, -1, -1, 0, -0.333, 0, -0.333, -1],
  9: [-1, -1, -1, -0.333, -0.333, -0.333, -0.333, -1]
}