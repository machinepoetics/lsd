import {
  ADD_POINT,
  AVERAGE_X,
  AVERAGE_Y,
  NUM_POINTS,
  NUM_SEGMENTS,
  POINT,
  POINTS,
  SEGMENTS,
  RESET_DATA,
  TIMESTAMP,
  TIMESTAMPS,
  ADD_TIMESTAMP,
} from '../constants'
import { Action, Coordinate } from '../types'

type State = {
  [AVERAGE_X]: number | undefined,
  [AVERAGE_Y]: number | undefined,
  [NUM_POINTS]: number,
  [NUM_SEGMENTS]: number,
  [POINTS]: Coordinate[],
  [TIMESTAMPS]: Date[]
}

const defaultState: State = {
  [AVERAGE_X]: undefined,
  [AVERAGE_Y]: undefined,
  [NUM_POINTS]: 0,
  [NUM_SEGMENTS]: 1, // TODO REPLACE THIS FROM CONFIGURATION
  [POINTS]: [],
  [TIMESTAMPS]: []
}

export const canvas = <T extends any>(state = defaultState, action: Action<T>) => {

  const points = state[POINTS]
  const numPoints = points.length

  const numSegments = state[NUM_SEGMENTS]
  const isSegmentBased = numSegments !== 0
  const sliceStart = numPoints - numSegments
  const sliceEnd = numPoints + 1

  switch (action.type) {
    case ADD_POINT:
      const point: Coordinate = action[POINT]


      // const { x, y } = point
      // const {
      //   x: prevX,
      //   y: prevY
      // } = points[currentNumPoints - 1] || { x: 0, y: 0 }

      // const currentXAverage = state[AVERAGE_X] as number
      // const currentYAverage = state[AVERAGE_Y] as number

      // const xAverage = currentXAverage === undefined ? x : ((currentNumPoints * currentXAverage) + x) / numPoints
      // const yAverage = currentYAverage === undefined ? x : ((currentNumPoints * currentYAverage) + y) / numPoints

      // const amplitude = 10 * 10
      // const frequency = 20 * 0.25 * 10
      // const transformedY = (x) => 300 + amplitude * Math.sin(x / frequency)

      // const deltasTransform = state[DELTAS_TRANSFORM]

      const aggregatePoints = [...points, point]

      return {
        ...state,
        // [DELTAS]: [...state[DELTAS], {
        //   x: point.x - prevX,
        //   y: point.y - prevY,
        // }],
        // [DELTAS_TRANSFORM]: [...state[DELTAS_TRANSFORM], {
        //   x: point.x - prevX,
        //   y: transformedY(point.x) - transformedY(prevX)

        // }],
        [POINTS]: isSegmentBased && numPoints > numSegments
          ? aggregatePoints.slice(sliceStart, sliceEnd)
          : aggregatePoints,
        // [POINTS]: aggregatePoints,
        // [AVERAGE_X]: xAverage,
        // [AVERAGE_Y]: yAverage,
        [NUM_POINTS]: numPoints
      }
    case ADD_TIMESTAMP:
      const timestamp: Date = action[TIMESTAMP]
      const timestamps = state[TIMESTAMPS]
      const aggregateTimestamps = [...timestamps, timestamp]

      return {
        ...state,
        [TIMESTAMPS]: isSegmentBased
          ? aggregateTimestamps.slice(sliceStart, sliceEnd)
          : aggregateTimestamps
      }
    case RESET_DATA:
      return defaultState
    default:
      return state
  }
}