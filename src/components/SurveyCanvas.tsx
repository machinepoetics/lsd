import React, {
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { eraseCanvas } from './Sketch'
import { Coordinate } from '../types'
import { BLACK } from '../styling'
import { State } from '../reducers'
import { generateUID, getRandomStyle } from '../survey'
import { Button } from 'rebass'
import { Label, Slider } from '@rebass/forms'


type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>
  erase: boolean
  height: number
  width: number
  margin: number
} & ConnectedProps<typeof connector>

const Base: React.FC<Props> = ({
  configuration,
  canvasRef,
  erase,
  height,
  width,
  margin
}) => {
  const [strength, setStrength] = useState(1)
  const [userId, setUserId] = useState(generateUID())
  const [styleData, setStyleData] = useState<any>()
  const [styleIndex, setStyleIndex] = useState(0)

  const [cursorStyle, setCursorStyle] = useState('auto')

  const [isPainting, setIsPainting] = useState(false)

  const [direction, setDirection] = useState<Coordinate>({x: 0, y: 0})
  
  const [lastMousePosition, setLastMousePosition] = useState<Coordinate | undefined>(undefined)

  useEffect(() => {
    eraseCanvas(canvasRef)
  }, [erase])

  useEffect(() => {
    getRandomStyle(userId).then(res => res.json()).then(res => {
      var styles = {dx: [], dy: []}
      res.dx.split(',').forEach((element: string) => {
        styles.dx.push(parseFloat(element))
      });
      res.dy.split(',').forEach((element: string) => {
        styles.dy.push(parseFloat(element))
      });
      setStyleData(_ => styles)
    });
  }, [])

  const onMouseDown = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current)
        return
    const coordinates = getCoordinates(event)
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (!!coordinates && !!context) {
      console.log("begin painting")
      setIsPainting(true)

      const pos = applyStyle(coordinates)
      context.beginPath()
      context.moveTo(pos.x, pos.y)

      setCursorStyle('none');
    }
  },[styleIndex, styleData, direction, isPainting])

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current)
        return

    const pos = getCoordinates(event)
    setLastMousePosition(pos)

    if (!!pos && !!lastMousePosition) {
      const dir = getDir(pos, lastMousePosition)
      setDirection(dir)
    }
    if (isPainting) {
      const coordinates = getCoordinates(event)
      const canvas: HTMLCanvasElement = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return

      const newPos = applyStyle(pos)
      console.log(newPos)
      context.lineTo(newPos.x, newPos.y)
      context.stroke()

      const newIndex = styleIndex < styleData.dx.length ? styleIndex + 1 : 0
      setStyleIndex(newIndex)
    }
  }, [styleIndex, styleData, direction, isPainting, lastMousePosition])
  
  const onMouseUp = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current)
      return
    setIsPainting(false)
    
    const coordinates = getCoordinates(event)
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (!!coordinates && !!context && isPainting) {
      const pos = applyStyle(coordinates)
      context.lineTo(pos.x, pos.y)
      context.stroke()
      context.closePath()
    }
    else if (!!context) {
      context.closePath()
    }

    setCursorStyle('auto');
  }, [styleIndex, styleData, direction, isPainting])

  const onMouseLeave = useCallback((event: MouseEvent) => {
    onMouseUp(event)
  }, [styleIndex, styleData, direction, isPainting])

  useEffect(() => {
    if (!canvasRef || !canvasRef.current)
        return
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    Object.assign(context, {
      lineJoin: 'round',
      lineWidth: 0.8,
      strokeStyle: BLACK
    })
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseDown, onMouseMove, onMouseLeave, onMouseUp])

  const getCoordinates = (event: MouseEvent) => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    }
  }

  const applyStyle = (pos : Coordinate): Coordinate => {
    const dir : Coordinate = direction
    const sx : number = styleData.dx[styleIndex]
    const sy : number = styleData.dy[styleIndex]
    return {x: pos.x + dir.x * strength * sx, y: pos.y + dir.y * strength * sy}
  }

  const getDir = (mousePos : Coordinate, oldMousePos : Coordinate) => {
    const dir = {x: mousePos.x - oldMousePos.x, y: mousePos.y - oldMousePos.y}
    const len2 = dir.x * dir.x + dir.y * dir.y
    if (len2 > 1e-8) {
      const len = Math.sqrt(len2)
      dir.x /= len;
      dir.y /= len;
    }
    console.log(dir)
    return dir
  }

  return <>
  <canvas
    ref={canvasRef}
    height={height}
    width={width}
    style={{
      border: `1px solid ${BLACK}`,
      marginRight: `${margin}px`,
      borderRadius: "3px",
      cursor: cursorStyle
    }}
  />
  <br></br>
  <Label htmlFor='strength'>Strength</Label>
  <Slider
    id='strength'
    name='strength'
    value={strength}
    onChange={(evt) => {setStrength(parseFloat(evt.target.value))}}
    min={0.0}
    max={10.0}
    type={'range'}
    step={0.01}
  />
  <br></br>
  <Button onClick={() => console.log(styleData)}>Submit</Button>
  </>
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const SurveyCanvas = connector(Base)