import { X, Y, DELAY, M, N } from "../constants";

export type Coordinate = {
  x: number;
  y: number;
};

export type Matrix = {
  [M]: number;
  [N]: number;
};

export type Delay = {
  [DELAY]: number;
};

export type Anchor = {
  [X]: number;
  [Y]: number;
};

export type DrawValues = Matrix & Delay;

export type Plane = any;
