import { LINE_TO, MOVE_TO, SQUARE } from '../constants'
import { Instruction, Transformation } from '../types'

export const square: Transformation =
{
  id: SQUARE,
  transformation: ({ args }) => {
    const {
      index_distance = 0,
      points = []
    } = args

    const numPoints = points.length

    if (numPoints > 1) {

      return points.reduce<Instruction[]>((acc, point, index) => {
        const startPoint = point
        const endPoint = points[index - 1]

        if (!!endPoint) {
          const slope = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)
          const b = endPoint.y - slope * endPoint.x

          const y_i = (x_i: number, slope: number, b: number) => slope * x_i + b

          const x_1 = endPoint.x - index_distance
          const y_1 = y_i(x_1, slope, b) + index_distance
          const x_2 = endPoint.x + index_distance
          const y_2 = y_i(x_2, slope, b) - index_distance

          acc = [
            ...acc,
            {
              x: startPoint.x,
              y: startPoint.y,
              type: MOVE_TO
            },
            {
              x: endPoint.x,
              y: y_2,
              type: LINE_TO
            }, {
              x: endPoint.x,
              y: y_2,
              type: MOVE_TO
            }, {
              x: x_1,
              y: y_2,
              type: LINE_TO
            }, {
              x: x_1,
              y: y_2,
              type: MOVE_TO
            }, {
              x: x_1,
              y: y_1,
              type: LINE_TO
            }, {
              x: x_1,
              y: y_1,
              type: MOVE_TO
            }, {
              x: x_2,
              y: y_1,
              type: LINE_TO
            }, {
              x: x_2,
              y: y_1,
              type: MOVE_TO
            }, {
              x: x_2,
              y: y_2,
              type: LINE_TO
            }, {
              x: x_2,
              y: y_2,
              type: MOVE_TO
            }, {
              x: endPoint.x,
              y: endPoint.y,
              type: LINE_TO
            }
          ]
        }

        return acc
      }, [])
    }

    return []
  }
}