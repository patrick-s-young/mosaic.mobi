import type { NumTilesToString, TimeGroup } from "@typescript/types";

export type TimeGroupCollection = { [key in NumTilesToString] : TimeGroup };