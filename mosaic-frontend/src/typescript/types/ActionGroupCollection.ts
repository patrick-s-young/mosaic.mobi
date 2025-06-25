import type { NumTilesToString } from "./NumTilesToString";

type ActionGroup = Array<Array<number>>;
export type ActionGroupCollection = { [key in NumTilesToString] : ActionGroup };