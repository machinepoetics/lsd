import {
  AMPLITUDE,
  DELAY,
  DATA_FORMAT,
  FREQUENCY,
  NUM_LINES,
  NUM_SEGMENTS,
  X,
  Y,
  SET_AMPLITUDE,
  SET_DELAY,
  SET_DATA_FORMAT,
  SET_FREQUENCY,
  SET_NUM_LINES,
  SET_X,
  SET_Y,
  SET_NUM_SEGMENTS
} from '../constants'
import { Action } from '../types'

export const configuration = <T extends unknown>(
  state = {
    [AMPLITUDE]: 10,
    [DATA_FORMAT]: 1,
    [DELAY]: 1,
    [FREQUENCY]: 20,
    [NUM_LINES]: 1,
    [NUM_SEGMENTS]: 2,
    [X]: 0,
    [Y]: 0,
  }, action: Action<T>) => {
  switch (action.type) {
    case SET_DELAY:
      return {
        ...state,
        [DELAY]: action[DELAY]
      }
    case SET_DATA_FORMAT:
      return {
        ...state,
        [DATA_FORMAT]: action[DATA_FORMAT]
      }
    case SET_NUM_LINES:
      return {
        ...state,
        [NUM_LINES]: action[NUM_LINES]
      }
    case SET_NUM_SEGMENTS:
      return {
        ...state,
        [NUM_SEGMENTS]: action[NUM_SEGMENTS]
      }
    case SET_X:
      return {
        ...state,
        [X]: action[X]
      }
    case SET_Y:
      return {
        ...state,
        [Y]: action[Y]
      }
    case SET_AMPLITUDE:
      return {
        ...state,
        [AMPLITUDE]: action[AMPLITUDE]
      }
    case SET_FREQUENCY:
      return {
        ...state,
        [FREQUENCY]: action[FREQUENCY]
      }
    default:
      return state
  }
}