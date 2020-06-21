import { LINE_TO, MOVE_TO, SCALE_Y } from '../constants'
import { Transformation } from '../types'

export const scale_y: Transformation = {
  id: SCALE_Y,
  transformation: ({ args }) => {
    const {
      points = [],
      scale_y = 1
    } = args

    return points.map((point, index) => ({
      x: point.x,
      y: Math.floor(point.y * scale_y),
      type: index === 0 ? MOVE_TO : LINE_TO
    }))
  }
}