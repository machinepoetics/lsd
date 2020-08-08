import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  ConnectedProps,
  connect,
  useDispatch,
  useSelector
} from 'react-redux'
// import debounce from 'lodash.debounce'
// import throttle from 'lodash.throttle'
import update from 'react-addons-update'
import {
  Box,
  Button,
  Flex,
  Text
} from 'rebass'

import { 
  generateUID, 
  getRandomStyle,
  sendSketch,
  DRAWING_TASKS,
  PARAMETERS_GROUP,
  RANDOMIZE,
  CONFIRM_BOX,
  INTRO_BOX,
  ENDING_BOX
} from '../survey'

import { BLACK, GRAY, defaultFontProps } from '../styling'
import { Coordinate, Plane as PlaneID } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { State } from '../reducers'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const DEBUG = true

type Props = {
  width: number
  height: number
} & ConnectedProps<typeof connector>


export type DrawParameters = {
  canvas: HTMLCanvasElement
  filter?: string
  n?: number
  transformation?: ({ x, y }: Coordinate) => Coordinate
}

export const eraseCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (!canvasRef || !canvasRef.current)
    return

  const canvas: HTMLCanvasElement = canvasRef.current
  const context = canvas.getContext('2d')

  if (!!context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function shuffleArray(array) {
  array = array.slice()
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}

const TASKS = shuffleArray(DRAWING_TASKS).slice(0, 3)
const PROMPTS = {
  1: "Please draw " + TASKS[0],
  2: "Please draw " + TASKS[1],
  3: "Please draw " + TASKS[2]
}

let SECTION_PARAMETERS;
if (RANDOMIZE) {
  let arr = shuffleArray(['control', 'weak', 'strong'])
  SECTION_PARAMETERS = {
    1: arr[0],
    2: arr[1],
    3: arr[2]
  }
}
else{ 
  SECTION_PARAMETERS = {
    1: 'control',
    2: 'weak',
    3: 'strong'
  }
}

const Base: React.FC<Props> = ({
  width,
  height,
}) => {
  const [isPainting, setIsPainting] = useState(false)
  const [erase, setErase] = useState(false);
  const [strength, setStrength] = useState(0)
  const [userId, setUserId] = useState(generateUID())
  const [styleData, setStyleData] = useState<any>()
  const [styleIndex, setStyleIndex] = useState(0)
  const [sampleInterval, setSampleInterval] = useState(2)
  const [reloadStyle, setReloadStyle] = useState(false)
  const [cursorStyle, setCursorStyle] = useState('auto')
  const [section, setSection] = useState<number>(1);
  const [lastMousePosition, setLastMousePosition] = useState<Coordinate | undefined>(undefined)
  const [showConfirm, setShowConfirm] = useState(true)
  const [showIntro, setShowIntro] = useState(true);
  const [showEnding, setShowEnding] = useState(false)
  const [submission, setSubmission] = useState<any>({
    1: false,
    2: false,
    3: false
  })
  const [sequence, setSequence] = useState([])
  const [copied, setCopied] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [curve, setCurve] = useState({
    direction: {x:0, y:0},
    lastStroke: {x:0, y:0},
    strokeDirection: {x:0, y:0},
    remainingDist: 0
  })

  const eraseSurveyCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!canvasRef || !canvasRef.current)
      return
  
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
  
    if (!!context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    setSequence(_ => [])
  }

  const ACTIONS = [
    {
      id: 1,
      text: "Section 1",
      fx: () => { tryChangeSection(1) }
    },
    {
      id: 2,
      text: "Section 2",
      fx: () => { tryChangeSection(2) }
    },
    {
      id: 3,
      text: "Section 3",
      fx: () => { tryChangeSection(3) }
    }
  ]

  useEffect(() => {
    if (section > 3) {
      setShowConfirm(false)
      setShowEnding(true)
      uploadResults()
      return
    }
    setStrength(PARAMETERS_GROUP[SECTION_PARAMETERS[section]].strength)
    setSampleInterval(PARAMETERS_GROUP[SECTION_PARAMETERS[section]].sampleInterval)
  }, [section])
  
  useEffect(() => {
    eraseSurveyCanvas(canvasRef)
    setErase(false)
  }, [erase])

  const tryChangeSection = (i : number) => {
    if (i === section) return;
    if (!submission[i]) {
      setShowConfirm(true);
    }
  }

  const uploadResults = () => {
    console.log('upload results...')
    console.log(submission);
    sendSketch(userId, JSON.stringify(submission), DEBUG)
  }

  useEffect(() => {

  }, [showEnding])

  const submit = () => {
    const newSubmission = JSON.parse(JSON.stringify(submission))
    newSubmission[section] = {
      sequence: sequence.slice(),
      strength: strength,
      sampleInterval: sampleInterval,
      styles: styleData,
      prompt: PROMPTS[section]
    };
    setSubmission(newSubmission)

    eraseSurveyCanvas(canvasRef)

    setSection(section + 1)
    setShowConfirm(false)
  }

  useEffect(() => {
    getRandomStyle(userId).then(res => res.json()).then(res => {
      var styles = {dx: [], dy: [], z_0: 0, z_1: 0, z_2: 0}
      res.dx.split(',').forEach((element: string) => {
        styles.dx.push(parseFloat(element))
      });
      res.dy.split(',').forEach((element: string) => {
        styles.dy.push(parseFloat(element))
      });
      styles.z_0 = res.z_0;
      styles.z_1 = res.z_1;
      styles.z_2 = res.z_2;
      setStyleData(_ => styles)
      
    });
    setReloadStyle(false)
  }, [reloadStyle, erase])

  const onMouseDown = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current || showConfirm)
        return
    const coordinates = getCoordinates(event)
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (!!coordinates && !!context) {
      const newCurve = curve

      const pos = applyStyle(coordinates, newCurve.direction, styleIndex)
      newCurve.remainingDist = 0
      newCurve.lastStroke = pos
      context.beginPath()
      context.moveTo(pos.x, pos.y)
      const now = Date.now()
      setSequence([...sequence, {type: 'start', x: pos.x, y: pos.y, t: now}])

      setCurve(newCurve)
      setIsPainting(true)

      // hide cursor
      setCursorStyle('none');
      
    }
  },[styleIndex, styleData, curve, sequence, showConfirm])

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current || showConfirm)
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

        const now = Date.now()
        setSequence([...sequence, 
          {type: 'lineTo', x: newPos.x, y: newPos.y, t: now}, 
          {type: 'mouseTo', x: pos.x, y: pos.y, t: now}])

        newCurve.lastStroke = newPos
        newIndex = newIndex < styleData.dx.length - 1 ? newIndex + 1 : 0
        newCurve.remainingDist -= sampleInterval
        newCurve.lastStroke = newPos
      }
      setStyleIndex(newIndex)
      setCurve(newCurve)
    }
  }, [styleIndex, styleData, curve, isPainting, lastMousePosition, sequence, showConfirm])
  
  const onMouseUp = useCallback((event: MouseEvent) => {
    if (!canvasRef || !canvasRef.current || showConfirm)
      return
    
    const coordinates = getCoordinates(event)
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    if (!!coordinates && isPainting) {
      const pos = applyStyle(coordinates, curve.direction, styleIndex)
      //context.quadraticCurveTo(curve.lastStroke.x, curve.lastStroke.y, pos.x, pos.y)
      context.lineTo(pos.x, pos.y)
      context.stroke()

      const now = Date.now()
      setSequence([...sequence, 
        {type: 'lineTo', x: pos.x, y: pos.y, t: now}, 
        {type: 'mouseTo', x: coordinates.x, y: coordinates.y, t: now},
        {type: 'end', t: now}
      ])
    }
    context.closePath()

    setIsPainting(false)
    // show cursor
    setCursorStyle('auto');
  }, [styleIndex, styleData, curve, isPainting, sequence, showConfirm])

  const onMouseLeave = useCallback((event: MouseEvent) => {
    onMouseUp(event)
  }, [styleIndex, styleData, curve, isPainting, sequence, showConfirm ])

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

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
    }
  }, [onMouseDown])

  useEffect(() => {
    if (!canvasRef || !canvasRef.current)
        return
    const canvas: HTMLCanvasElement = canvasRef.current
    canvas.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [onMouseMove])
  
  useEffect(() => {
    if (!canvasRef || !canvasRef.current)
        return
    const canvas: HTMLCanvasElement = canvasRef.current
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseUp])

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

  const menuStyles = {
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px",
    ':hover': {
      background: "white",
      borderColor: GRAY,
      color: "black",
      cursor: "pointer",
      transition: "0.3s"

    }
  }

  return <>
    {showConfirm && 
      <>
      <Flex width={0.5} 
        display='block' 
        style={{
          background: '#f0f0f0',
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
      {showIntro &&
        <Box
        fontSize={3}>
        {INTRO_BOX}
        <br></br>
        <Flex>
          <Button display='block' margin='auto'
            bg='blue'
            {...defaultFontProps}
            sx={menuStyles}
            onClick={() => {setShowIntro(false); setShowConfirm(false)}}>Confirm</Button>
        </Flex>
        
      </Box>
      }
      {!showIntro &&
        <Box
        fontSize={3}>
        {CONFIRM_BOX + section}.
        <br></br>
        <Flex>
          <Box width={1/2}>
          <Button display='block' margin='auto'
            bg='grey'
            {...defaultFontProps}
            sx={menuStyles}
            onClick={() => {setShowConfirm(false)}}>Return</Button>
          </Box>
          <Box width={1/2}>
          <Button display='block' margin='auto'
            bg='blue'
            {...defaultFontProps}
            sx={menuStyles}
            onClick={() => {submit()}}>Submit</Button>
          </Box>
        </Flex>
        
      </Box>
      }
      
      </Flex>
      </>
    }
    {showEnding &&
      <Flex width={0.5} 
        display='block' 
        style={{
          background: '#f0f0f0',
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
      }}>
        <Box>
          {ENDING_BOX} 
          <br></br>
          Make sure to include your unique survey ID <b>{userId}</b> in the form.
          <CopyToClipboard 
            text={userId}
            onCopy={() => setCopied(true)}
            style={{
              display: 'block',
              margin: 'auto'
            }}
            >
          <button>Copy to clipboard</button>
          </CopyToClipboard>
          {copied && <Text color='blue' fontSize='12px'>Copied!</Text>}
        </Box>
      </Flex>
    }
        
    {!showEnding &&
      <Box 
      style={{
        position: 'fixed',
        left: '10px',
        top: '10px',
      }}>
      User ID: <b>{userId}</b> <br></br>
      <CopyToClipboard 
          text={userId}
          onCopy={() => setCopied(true)}
          style={{
            display: 'block',
            margin: 'auto'
          }}
          >
        <button>Copy to clipboard</button>
        </CopyToClipboard>
        {copied && <Text color='blue' fontSize='12px'>Copied!</Text>}
    </Box>
    }
    

    
    <Flex width={width} margin='auto'>
      <Box margin='auto' display='block'>
      {
        ACTIONS.map((action) =>
        <Button
          key={action.text}
          onClick={action.fx}
          bg={action.id === section ? 'blue' : 'gray'}
          mb={3}
          mr={2}
          {...defaultFontProps}
          sx={menuStyles}
        >{action.text}</Button>
        )
      }
      </Box>
    </Flex>
      
    {!showEnding &&
    <>
          <Box margin='auto' display='block'>
            <Text fontSize='17px' textAlign='center'>{PROMPTS[section]}</Text>
          </Box>
          {!!!submission[section] && !showEnding &&
            <>
              <br></br>
              <Flex width={width} margin='auto'>
              <Box width={1/2}>
                <Button 
                  margin='auto'  
                  display='block'
                  backgroundColor='lightblue' 
                  {...defaultFontProps}
                  sx={menuStyles}
                  onClick={() => setErase(true)}>Erase
                </Button>
              </Box>

              <Box width={1/2}>
              <Button 
                margin='auto'  
                display='block'
                backgroundColor='blue' 
                {...defaultFontProps}
                sx={menuStyles}
                onClick={() => tryChangeSection(section+1)}>Submit
                </Button>
              </Box>

              </Flex>
              
            </>
            }
            {!!submission[section] && !showEnding &&
              <Text>You have finished this section</Text>
            }
            <br></br>
          <canvas
              ref={canvasRef}
              height={height}
              width={width}
              style={{
                border: `1px solid ${BLACK}`,
                borderRadius: "3px",
                margin: 'auto',
                display: 'block',
                cursor: cursorStyle
              }}
            />
    </>
    }
      
  </>
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const Sketch = connector(Base)