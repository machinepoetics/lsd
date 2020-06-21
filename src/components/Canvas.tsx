import React, {
  useEffect,
  useRef
} from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { eraseCanvas } from './Sketch'
import {
  AMPLITUDE,
  FREQUENCY,
  DELAY,
  SIN,
  COS,
  X,
  Y
} from '../constants'
import { Coordinate } from '../types'
// import debounce from 'lodash.debounce'
import { State } from '../reducers'
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
  waveStyle?: typeof SIN | typeof COS
  direction?: typeof X | typeof Y
} & ConnectedProps<typeof connector>

const Base: React.FC<Props> = ({
  configuration,
  erase,
  index,
  height,
  width,
  margin,
  mousePosition,
  originalMousePosition,
  scalingFactor,
  waveStyle,
  direction
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const delay = useSelector(() => configuration[DELAY]) * 100
  const amplitude = useSelector(() => configuration[AMPLITUDE])
  const frequency = useSelector(() => configuration[FREQUENCY])

  useEffect(() => {
    eraseCanvas(canvasRef)
  }, [erase])

  const drawLine = () => {

    if (!canvasRef || !canvasRef.current)
      return

    const canvas: HTMLCanvasElement = canvasRef.current

    const context = canvas.getContext('2d')

    if (context) {
      Object.assign(context, {
        lineJoin: 'round',
        lineWidth: 0.1,
        strokeStyle: "#000"
      })

      context.beginPath()

      const draw = () => {
        if (!!originalMousePosition && !!mousePosition) {
          const tfx = (coordinate: Coordinate | undefined) => {

            if (!coordinate)
              return { x: null, y: null }

            const { x: xOriginal, y: yOriginal } = coordinate
            const wave = waveStyle === SIN ? Math.sin : Math.cos

            const x = (height / 2 +
              (amplitude * index) * wave(yOriginal / (frequency * index)
              )) + xOriginal

            const y = (height / 2 +
              (amplitude * index) * wave(xOriginal / (frequency * index)
              )) + yOriginal

            return {
              x: (direction === X ? xOriginal : x) / scalingFactor,
              y: (direction === Y ? yOriginal : y) / scalingFactor
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

      delay !== 0
        ? setTimeout(() => { draw() }, delay * index)
        : draw()
    }
  }

  useEffect(() => {
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

export const Canvas = connector(Base)