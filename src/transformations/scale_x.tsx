import { SCALE_X, MOVE_TO, LINE_TO } from '../constants'
import { Transformation } from '../types'

export const scale_x: Transformation = {
  id: SCALE_X,
  transformation: ({ args }) => {
    const {
      points = [],
      scale_x = 1
    } = args

    return points.map((point, index) => ({
      x: Math.floor(point.x * scale_x),
      y: point.y,
      type: index === 0 ? MOVE_TO : LINE_TO
    }))
  }
} 