import type { NumTilesToString } from "./NumTilesToString";

type Action = { time: number, action: string }
type ActionGroup = Array<Array<Action>>;
export type ActionGroupCollection = { [key in NumTilesToString] : ActionGroup };