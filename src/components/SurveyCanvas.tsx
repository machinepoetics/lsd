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
  const [strength, setStrength] = useState(1.0)
  const [userId, setUserId] = useState(generateUID())
  const [styleData, setStyleData] = useState<any>()
  const [styleIndex, setStyleIndex] = useState(0)
  const [sampleInterval, setSampleInterval] = useState(2)
  const [reloadStyle, setReloadStyle] = useState(false)

  const [cursorStyle, setCursorStyle] = useState('auto')

  const [isPainting, setIsPainting] = useState(false)

  const [curve, setCurve] = useState({
    direction: {x:0, y:0},
    lastStroke: {x:0, y:0},
    strokeDirection: {x:0, y:0},
    remainingDist: 0
  })
  
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
    setReloadStyle(false)
  }, [reloadStyle])

  const onMouseDown = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current)
        return
    const coordinates = getCoordinates(event)
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (!!coordinates && !!context) {
      console.log("begin painting")
      setIsPainting(true)

      const newCurve = curve

      const pos = applyStyle(coordinates, newCurve.direction, styleIndex)
      newCurve.remainingDist = 0
      newCurve.lastStroke = pos
      context.beginPath()
      context.moveTo(pos.x, pos.y)

      setCurve(newCurve)

      // hide cursor
      setCursorStyle('none');
    }
  },[styleIndex, styleData, curve, isPainting])

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current)
        return

    const pos = getCoordinates(event)
    setLastMousePosition(pos)

    const newCurve = curve

    if (!!pos && !!lastMousePosition) {
      const dir = getDir(lastMousePosition, pos)
      newCurve.direction = dir
      if (!isPainting) newCurve.strokeDirection = dir
    }
    if (isPainting) {
      const coordinates = getCoordinates(event)
      const canvas: HTMLCanvasElement = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return

      const dist = getDistance(pos, lastMousePosition)
      newCurve.remainingDist += dist
      const totalDist = newCurve.remainingDist
      let newIndex = styleIndex
      while (newCurve.remainingDist > sampleInterval) {

        const ratio = (totalDist - newCurve.remainingDist) / totalDist
        const dir = normalize(lerpVector(curve.direction, newCurve.direction, ratio))
        let newPos = applyStyle(pos, dir, newIndex)
        //newCurve.strokeDirection = getDir(newCurve.lastStroke, newPos)
        //const temp = lerpVector(newCurve.lastStroke, lastMousePosition, 0.5)
        //context.quadraticCurveTo(temp.x, temp.y, newPos.x, newPos.y)
        newPos = lerpVector(newCurve.lastStroke, newPos, 0.3)
        context.lineTo(newPos.x, newPos.y)
        context.stroke()
        newCurve.lastStroke = newPos
        newIndex = newIndex < styleData.dx.length ? newIndex + 1 : 0
        newCurve.remainingDist -= sampleInterval
        newCurve.lastStroke = newPos
      }
      setStyleIndex(newIndex)
      setCurve(newCurve)
    }
  }, [styleIndex, styleData, curve, isPainting, lastMousePosition])
  
  const onMouseUp = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current)
      return
    setIsPainting(false)
    
    const coordinates = getCoordinates(event)
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (!!coordinates && !!context && isPainting) {
      const pos = applyStyle(coordinates, curve.direction, styleIndex)
      //context.quadraticCurveTo(curve.lastStroke.x, curve.lastStroke.y, pos.x, pos.y)
      context.lineTo(pos.x, pos.y)
      context.stroke()
      context.closePath()
    }
    else if (!!context) {
      context.closePath()
    }

    // show cursor
    setCursorStyle('auto');
  }, [styleIndex, styleData, curve, isPainting])

  const onMouseLeave = useCallback((event: MouseEvent) => {
    onMouseUp(event)
  }, [styleIndex, styleData, curve, isPainting])

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

  const applyStyle = (pos : Coordinate, dir : Coordinate, index : number): Coordinate => {
    const sx : number = styleData.dx[index]
    const sy : number = styleData.dy[index]
    const bitang = {x: -dir.y, y: dir.x}
    return {
      x: pos.x + (dir.x * sx + bitang.x * sy) * strength, 
      y: pos.y + (dir.y * sx + bitang.y * sy) * strength
    }
  }

  const getDistance = (a : Coordinate, b : Coordinate) => {
    const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
    return d2 > 0 ? Math.sqrt(d2) : 0
  }

  const lerpVector = (a : Coordinate, b : Coordinate, t : number) => {
    return {
      x : a.x + (b.x - a.x)*t,
      y : a.y + (b.y - a.y)*t
    }
  }

  const normalize = (a : Coordinate) => {
    const len2 = a.x * a.x + a.y * a.y
    if (len2 > 1e-8) {
      const len = Math.sqrt(len2)
      a.x /= len; a.y /= len;
    }
    return a
  }

  const getDir = (from : Coordinate, to : Coordinate) => {
    const dir = {x: to.x - from.x, y: to.y - from.y}
    const len2 = dir.x * dir.x + dir.y * dir.y
    if (len2 > 1e-8) {
      const len = Math.sqrt(len2)
      dir.x /= len;
      dir.y /= len;
    }
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
  <Label htmlFor='strength'>Strength {strength}</Label>
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
  <Label htmlFor='sampleInterval'>Sample Interval {sampleInterval}</Label>
  <Slider
    id='sampleInterval'
    name='sampleInterval'
    value={sampleInterval}
    onChange={(evt) => {setSampleInterval(parseFloat(evt.target.value))}}
    min={0.5}
    max={10.0}
    type={'range'}
    step={0.01}
  />
  <br></br>
  <Button onClick={() => console.log(styleData)}>Submit</Button>
  <br></br>
  <Button onClick={() => setReloadStyle(true)}>Reload Style</Button>
  </>
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const SurveyCanvas = connector(Base)