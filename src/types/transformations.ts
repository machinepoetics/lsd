import {
  ARC,
  CIRCLE,
  LINE_TO,
  MOVE_TO,
  SCALE_X,
  SCALE_Y,
  SQUARE
} from "../constants";
import { Coordinate } from "./";

export type Instruction = {
  type?: typeof ARC | typeof LINE_TO | typeof MOVE_TO;
  radius?: number;
} & Coordinate;

export type Args = {
  points?: Coordinate[];
  index_distance?: number;
  distance?: number;
  scale_x?: number;
  scale_y?: number;
};

export type Transformation = {
  id: typeof CIRCLE | typeof SQUARE | typeof SCALE_X | typeof SCALE_Y;
  transformation: ({ args }: { args: Args }) => Instruction[];
};
