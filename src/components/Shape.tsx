import React, { useEffect, useRef } from 'react'
import { eraseCanvas } from './Sketch'
import { Coordinate } from '../types'
import { GRAY } from '../styling'

type Props = {
  erase: boolean
  height: number
  width: number
  margin: number
  mousePosition: Coordinate | undefined
  originalMousePosition: Coordinate | undefined
}

const iterations = Math.floor(Math.random() * 8) + 1
const iterationsArray = [...Array(iterations)]

export const Shape: React.FC<Props> = ({
  erase,
  height,
  width,
  mousePosition,
  originalMousePosition
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawShape = () => {
    if (!canvasRef || !canvasRef.current || !originalMousePosition || !mousePosition)
      return

    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')


    if (!!context) {
      iterationsArray.map((_, index) => {

        Object.assign(context, {
          lineJoin: 'round',
          lineWidth: 0.3,
        })

        const offset = (index * 2)

        const { x: xMoveTo, y: yMoveTo } = originalMousePosition
        const { x: xLineTo, y: yLineTo } = mousePosition
        const sign = Math.pow(-1, index)

        setTimeout(() => {
          context.strokeStyle = "transparent"
          context.fillStyle = "rgba(0, 0, 0, 0.15)"
          context.fill()
          context.beginPath()
          context.moveTo(xMoveTo + (offset * sign), yMoveTo + (offset * sign))
          context.arcTo(
            xMoveTo,
            yMoveTo,
            xLineTo + offset,
            yLineTo + offset,
            (Math.random() * 20) + iterations
          )
          context.closePath()
          context.stroke()

        }, index * 100)
      })

      const fadeOut = () => {
        context.fillStyle = "rgba(255,255,255, 0.01)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (Math.random() > 0.85) {
        fadeOut()
      }
    }
  }

  useEffect(() => {
    drawShape()
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