import React, { useEffect, useRef } from 'react'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux'
import { eraseCanvas } from './Sketch'
import {
  ADD_POINT,
  AVERAGE_X,
  AVERAGE_Y
} from '../constants'
import { addPoint } from '../actions'
import { Coordinate } from '../types'
import { GRAY } from '../styling'
import { State } from '../reducers'

type Props = {
  erase: boolean
  height: number
  width: number
  margin: number
  mousePosition: Coordinate | undefined
  originalMousePosition: Coordinate | undefined
} & ConnectedProps<typeof connector>

const iterations = Math.floor(Math.random() * 8) + 1
const iterationsArray = [...Array(iterations)]

const Base: React.FC<Props> = ({
  canvas,
  erase,
  height,
  width,
  mousePosition,
  originalMousePosition
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dispatch = useDispatch()

  const xAverage = useSelector(() => canvas[AVERAGE_X])
  const yAverage = useSelector(() => canvas[AVERAGE_Y])

  const drawAverage = () => {
    if (!canvasRef || !canvasRef.current || !originalMousePosition || !mousePosition)
      return

    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')

    if (!!context && !!xAverage && !!yAverage) {
      iterationsArray.map((_, index) => {

        Object.assign(context, {
          lineJoin: 'round',
          lineWidth: 0.3,
        })

        context.strokeStyle = "rgba(0, 0, 0, 0.3)"
        context.beginPath()
        context.moveTo(xAverage - 10, yAverage - 10)
        context.lineTo(xAverage, yAverage)
        context.closePath()
        context.stroke()
      })
    }
  }

  useEffect(() => {
    if (mousePosition !== undefined) {
      dispatch(addPoint(mousePosition))
    }

    drawAverage()
  }, [originalMousePosition])

  useEffect(() => {
    eraseCanvas(canvasRef)
  }, [erase])

  return <canvas ref={canvasRef}
    height={height}
    width={width}
    style={{
      border: `1px solid ${GRAY}`,
      borderRadius: "5px",
      marginLeft: "16px"
    }}
  />
}

const mapState = (state: State) => ({
  canvas: state.canvas
})

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const Average = connector(Base)