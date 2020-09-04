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
  ENDING_BOX,
  DEBUG
} from '../survey'

import { BLACK, GRAY, defaultFontProps } from '../styling'
import { Coordinate, Plane as PlaneID } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { State } from '../reducers'
import {CopyToClipboard} from 'react-copy-to-clipboard';


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
    remainingDist: 0,
    angle: null
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
    const lastAngle = curve.angle

    if (!!pos && !!lastMousePosition) {
      const dir = getDir(lastMousePosition, pos)
      newCurve.direction = dir
      if (!curve.angle) {
        // means that the mouse button was just pressed
        newCurve.angle = Math.atan2(dir.y, dir.x);
      }
      else {
        // EMA for smoothing
        newCurve.angle = lerpAngle(curve.angle, Math.atan2(dir.y, dir.x), 0.2);
      }
    }
    else {return;}

    if (isPainting) {
      const canvas: HTMLCanvasElement = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return

      const dist = getDistance(pos, lastMousePosition)
      newCurve.remainingDist += dist
      const totalDist = newCurve.remainingDist
      let newIndex = styleIndex
      while (newCurve.remainingDist > sampleInterval) {

        var baseStrength = PARAMETERS_GROUP[SECTION_PARAMETERS[section]].strength;
        var multiplier;
        if(section == 2) {
          const deltaAngle = newCurve.angle - lastAngle
          console.log("@ delta angle =", deltaAngle)
          multiplier = (clamp(Math.abs(deltaAngle), 0.1, 0.3) - 0.1) * 10;
          console.log("* multiplier =", multiplier)
        }
        else {
          multiplier = 1;
        }
        setStrength(baseStrength * multiplier);
        let newPos = applyStyle(pos, normalize(newCurve.direction), newIndex)

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
      }
      setStyleIndex(newIndex)
      setCurve(newCurve)
    }
  }, [styleIndex, styleData, curve, isPainting, lastMousePosition, sequence, showConfirm, strength])
  
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
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,//canvas.offsetLeft,
      y: event.clientY - rect.top//canvas.offsetTop
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

  const lerp = (a : number, b : number, t : number) => {
    return a + (b - a) * t;
  }

  const lerpVector = (a : Coordinate, b : Coordinate, t : number) => {
    return {
      x : a.x + (b.x - a.x)*t,
      y : a.y + (b.y - a.y)*t
    }
  }

  const clamp = (x : number, a : number, b : number) => {
    if (x < a) return a;
    if (x > b) return b;
    return x;
  }

  const lerpAngle = (a : number, b : number, t : number) => {
    const x = b - a;
    const PI2 = 2.0 * Math.PI;
    var delta = clamp(x - Math.floor(x / PI2) * PI2, 0.0, PI2);
    if (delta > Math.PI)
        delta -= Math.PI * 2;
    return a + delta * clamp(t, 0, 1);
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
      <Box
        display='block' 
        style={{
          width: '60%',
          background: '#f0f0f0',
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)'
        }}>
      {showIntro &&
        <Box
        fontSize={3} style={{textAlign: 'center'}}>
        {INTRO_BOX}
        <br></br>
        <Flex>
          <Button display='block' margin='auto'
            bg='blue'
            {...defaultFontProps}
            sx={menuStyles}
            onClick={() => {setShowIntro(false); setShowConfirm(false)}}>Start</Button>
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
      
      </Box>
      </>
    }
    
        
    {
      <Box 
      style={{
        position: 'fixed',
        left: '12%',
        top: '3px',
      }}>
      Survey ID: <b>{userId}</b> <br></br>
      <CopyToClipboard 
          text={userId}
          onCopy={() => setCopied(true)}
          style={{
            display: 'block',
            margin: 'auto'
          }}
          >
        <button>{copied ? 'Copied!' : 'Copy to clipboard'}</button>
        </CopyToClipboard>
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

    {showEnding &&
    <Box margin='auto' display='block'>
      <Text fontSize='17px' textAlign='center'>{ENDING_BOX}</Text>
    </Box>
    }
      
    {!showEnding &&
    <>
          {!showIntro &&
          <Box margin='auto' display='block'>
            <Text fontSize='17px' textAlign='center'>{PROMPTS[section]}</Text>
          </Box>
          }
          
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