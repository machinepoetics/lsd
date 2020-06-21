import {
  NUM_SEGMENTS,
  POINT,
  TIMESTAMP,
  SEGMENTS,
  SET_NUM_SEGMENTS,
  ADD_POINT,
  ADD_SEGMENT,
  ADD_TIMESTAMP,
  RESET_DATA
} from '../constants'
import { Coordinate } from '../types'

export const addPoint = (point: Coordinate) => ({
  type: ADD_POINT,
  [POINT]: point
})

export const resetData = () => ({
  type: RESET_DATA,
})

export const addTimestamp = (timestamp: number) => ({
  type: ADD_TIMESTAMP,
  [TIMESTAMP]: timestamp
})

export const setSegments = (segments: number) => ({
  type: SET_NUM_SEGMENTS,
  [NUM_SEGMENTS]: segments
})

export const addSegment = () => ({
  type: ADD_SEGMENT,
})