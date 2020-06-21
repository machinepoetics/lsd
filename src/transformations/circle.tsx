import { ARC, CIRCLE, MOVE_TO } from '../constants'
import { Transformation } from '../types'

export const circle: Transformation = {
  id: CIRCLE,
  transformation: ({ args }) => {
    const {
      index_distance = 0,
      points = []
    } = args

    const numPoints = points.length

    if (numPoints > 1) {
      const startPoint = points[0]
      const endPoint = points[1]
      const midPoint = {
        x: (endPoint.x + startPoint.x) / 2,
        y: (endPoint.y + startPoint.y) / 2
      }

      const distance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)) + index_distance

      return [
        {
          x: midPoint.x,
          y: midPoint.y,
          type: MOVE_TO
        }, {
          x: midPoint.x,
          y: midPoint.y,
          radius: distance,
          type: ARC,
        }
      ]
    }

    return []
  }
}