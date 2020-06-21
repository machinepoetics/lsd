import { LINE_TO, MOVE_TO, TANGENT_LINE } from '../constants'

// NEED TO FIX
// export const tangent = {
//   id: TANGENT_LINE,
//   transformation: ({ args }) => {
//     const {
//       points
//     } = args

//     const numPoints = points.length

//     if (numPoints > 1) {
//       return points.reduce((acc, point, index) => {

//         if (index === 0) {
//           return []
//         }

//         const startPoint = points[index - 1]
//         const endPoint = point

//         if (!!endPoint) {
//           const slope = Math.sign((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x))
//           const b = endPoint.y - slope * endPoint.x

//           const x_i = (y_i: number) => slope === 0 ? 999 : (y_i - b) / slope
//           const y_i = (x_i: number) => slope * x_i + b

//           const x_1 = x_i(0)
//           const y_1 = y_i(0)

//           acc = [
//             ...acc,
//             {
//               x: 0,
//               y: y_1,
//               type: MOVE_TO
//             },
//             {
//               x: x_1,
//               y: 0,
//               type: LINE_TO
//             }
//           ]
//         }

//         return acc
//       }, [])
//     }

//     return []
//   }
// }