import type { NumTiles } from '@typescript/types';
export interface MosaicSelectorButtonProps {
  numTiles: NumTiles;
  width: number;
  isSelected: boolean;
  onClick: (newNumTiles: NumTiles) => void;
}