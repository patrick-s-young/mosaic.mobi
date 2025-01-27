import type { NumTiles, Rect } from "@typescript/types";

type RectGroup = Array<Rect>;
export type RectGroupCollection = { [key in NumTiles] : RectGroup };