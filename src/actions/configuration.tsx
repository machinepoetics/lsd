import {
  DATA_FORMAT,
  NUM_LINES,
  M,
  N,
  X,
  Y,
  AMPLITUDE,
  FREQUENCY,
  SET_NUM_LINES,
  SET_M,
  SET_N,
  SET_X,
  SET_Y,
  DELAY,
  SET_DELAY,
  SET_AMPLITUDE,
  SET_FREQUENCY,
  SET_DATA_FORMAT
} from '../constants'
import { DrawValues } from '../types'

export const setM = (value: DrawValues[typeof M]) => ({
  type: SET_M,
  [M]: value
})

export const setN = (value: DrawValues[typeof N]) => ({
  type: SET_N,
  [N]: value
})

export const setX = (value: number) => ({
  type: SET_X,
  [X]: value
})

export const setY = (value: number) => ({
  type: SET_Y,
  [Y]: value
})

export const setDelay = (value: number) => ({
  type: SET_DELAY,
  [DELAY]: value
})

export const setNumLines = (value: number) => ({
  type: SET_NUM_LINES,
  [NUM_LINES]: value
})

export const setAmplitude = (value: number) => ({
  type: SET_AMPLITUDE,
  [AMPLITUDE]: value
})

export const setFrequency = (value: number) => ({
  type: SET_FREQUENCY,
  [FREQUENCY]: value
})

export const setDataFormat = (value: number) => ({
  type: SET_DATA_FORMAT,
  [DATA_FORMAT]: value
})