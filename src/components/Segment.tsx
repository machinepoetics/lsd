import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { eraseCanvas } from './Sketch'
import {
  ARC,
  DELAY,
  M,
  SEGMENTS,
  X,
  Y,
  POINTS,
  NUM_SEGMENTS,
  NUM_POINTS,
  TIMESTAMPS,
  TRANSFORMATIONS,
  LINE_TO,
  MOVE_TO
} from '../constants'
import { State } from '../reducers'
import { Args, Coordinate, Instruction } from '../types'
import { GRAY } from '../styling'

type Props = {
  erase: boolean
  index: number
  height: number
  width: number
  margin: number
  mousePosition: Coordinate | undefined
  originalMousePosition: Coordinate | undefined
  scalingFactor: number
} & ConnectedProps<typeof connector>

const CONJOINED = "conjoined"

const Base: React.FC<Props> = ({
  canvas,
  transformation,
  erase,
  index,
  height,
  width,
  margin,
  mousePosition,
  originalMousePosition,
  scalingFactor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const [variation, setVariation] = useState()
  // const delay = useSelector(() =>configuration[DELAY]) * 100
  const points = useSelector(() => canvas[POINTS])
  // const timestamps = useSelector(() =>canvas[TIMESTAMPS])
  const transformations = useSelector(() => transformation[TRANSFORMATIONS])
  // const numPoints = points.length
  // const numSegments = useSelector(() =>configuration[NUM_SEGMENTS])

  useEffect(() => {
    eraseCanvas(canvasRef)
  }, [erase])

  const drawLine = () => {

    if (!canvasRef || !canvasRef.current)
      return

    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')

    if (!!context) {

      Object.assign(context, {
        lineJoin: 'round',
        lineWidth: 0.1,
        strokeStyle: "rgba(0, 0, 0, 0.7)"
      })

      const pointArray = transformations.reduce<Instruction[]>((acc, type) => {
        acc = type.transformation({
          args: {
            points: acc.length > 0 ? acc : points,
            index_distance: 2 * (index + 1),
            distance: 30,
            scale_x: (index * 0.1) + 1,
            scale_y: (index * 0.3) + 1
          }
        })

        return acc
      }, [])

      pointArray.filter(point => point).map((point, index) => {
        const x = point.x / scalingFactor
        const y = point.y / scalingFactor

        switch (point.type) {
          case MOVE_TO:
            context.beginPath()
            context.moveTo(x, y)
            break
          case ARC:
            if (!!point.radius) {
              context.arc(x, y, point.radius, 0, 2 * Math.PI)
              context.closePath()
              context.stroke()
            }
            break
          default:
            context.lineTo(x, y)
            context.closePath()
            context.stroke()
            break

        }
      })

      context.closePath()
    }
  }

  useEffect(() => {
    setTimeout(() => {

      drawLine()
    }, index * 50)
  }, [originalMousePosition])

  return <canvas
    height={height}
    width={width}
    ref={canvasRef}
    style={{
      border: `1px solid ${GRAY}`,
      marginRight: `${margin}px`,
      borderRadius: "3px",
    }}
  />
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const Segment = connector(Base)