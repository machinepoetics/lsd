export const tree = {}

// import { LINE_TO, MOVE_TO, TREE } from '../constants'
// import { Transformation } from '../types'

// export const tree: Transformation = {
//   id: TREE,
//   transformation: ({ args }) => {
//     const {
//       index_distance,
//       points
//     } = args

//     const numPoints = points.length

//     if (numPoints > 1) {
//       const startPoint = points[0]
//       const endPoint = points[1]

//       const slope = endPoint.x - startPoint.x === 0 ? 0 : (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)
//       const b = endPoint.y - slope * endPoint.x

//       const x_1 = endPoint.x
//       const y_1 = endPoint.y
//       const x_2 = x_1 + index_distance
//       const y_2 = slope * x_2 + b

//       return [
//         {
//           x: x_1,
//           y: y_1,
//           type: MOVE_TO
//         },
//         {
//           x: x_2,
//           y: y_2,
//           type: LINE_TO
//         }
//       ]
//     }

//     return []
//   }
// }