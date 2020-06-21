import React, {
  useEffect,
  useRef
} from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { eraseCanvas } from './Sketch'
import { DELAY, NUM_LINES } from '../constants'
import { Coordinate } from '../types'
import { GRAY } from '../styling'
import { State } from '../reducers'

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

type DrawParameters = {
  index: number
  idx: number
}

const Base: React.FC<Props> = ({
  configuration,
  erase,
  index,
  height,
  width,
  margin,
  mousePosition,
  originalMousePosition,
  scalingFactor
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lines = useSelector(() => configuration[NUM_LINES])
  const delay = useSelector(() => configuration[DELAY]) * 100

  useEffect(() => {
    eraseCanvas(canvasRef)
  }, [erase])

  useEffect(() => {
    const drawLine = () => {

      if (!canvasRef || !canvasRef.current)
        return

      const canvas: HTMLCanvasElement = canvasRef.current

      const context = canvas.getContext('2d')

      if (context) {
        Object.assign(context, {
          lineJoin: 'round',
          lineWidth: 0.1,
          strokeStyle: 'rgba(0, 0, 0, 0.1)',
        })

        context.beginPath()

        const draw = ({ index, idx }: DrawParameters) => {
          if (!!originalMousePosition && !!mousePosition) {
            const tfx = (coordinate: Coordinate | undefined) => {

              if (!coordinate)
                return { x: null, y: null }

              const { x: xOriginal, y: yOriginal } = coordinate

              const x = xOriginal + idx * 10 * Math.pow(-1, idx)
              const y = yOriginal + index * 20 * Math.sin(yOriginal)

              return {
                x: (x) / scalingFactor,
                y: (y) / scalingFactor
              }
            }

            const { x: xMoveTo, y: yMoveTo } = tfx(originalMousePosition)
            const { x: xLineTo, y: yLineTo } = tfx(mousePosition)

            if (!!xMoveTo && !!yMoveTo && !!xLineTo && !!yLineTo) {
              context.moveTo(xMoveTo, yMoveTo)
              context.lineTo(xLineTo, yLineTo)
              context.closePath()
              context.stroke()
            }
          }
        }

        [...Array(lines)].forEach((_, idx) => {
          const params = { index, idx }
          setTimeout(() => {
            delay !== 0
              ? setTimeout(() => { draw(params) }, delay * index)
              : draw(params)
          }, idx * 1000)
        })
      }
    }

    drawLine()
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

export const SketchChild = connector(Base)