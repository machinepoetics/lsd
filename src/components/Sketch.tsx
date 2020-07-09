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
import {
  Box,
  Button,
  Flex,
  Text
} from 'rebass'
// import {
//   Select
// } from '@rebass/forms'
// @ts-ignore
import SlidingPane from 'react-sliding-pane';

import {
  addPoint,
  // addSegment,
  resetData,
  addTimestamp
} from '../actions'
import {
  // Average,
  Canvas,
  Configuration,
  Plane,
  Segment,
  Shape,
  SketchChild,
  Survey,
  SurveyCanvas,
  Timer
} from '../components'
import {
  // AVERAGE,
  CANVAS,
  CANVAS_GENERATIVE,
  COLUMN,
  CONFIGURATION,
  DATA_FORMAT,
  ROW,
  M,
  N,
  // NONE,
  POINTS,
  SHAPE,
  SIN,
  COS,
  X,
  Y,
  TIMESTAMPS,
  SEGMENT,
  SURVEY,
  SURVEY_CANVAS
} from '../constants';
import { BLACK, GRAY, defaultFontProps } from '../styling'
import { Coordinate, Plane as PlaneID } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { State } from '../reducers'
// import { electric_sheep } from '../data/electric_sheep'

/* === Partial implementation taken from: https://dev.to/ankursheel/react-component-to-fraw-on-a-page-using-hooks-and-typescript-2ahp === */

type Props = {
  width: number
  height: number
} & ConnectedProps<typeof connector>

type Delta = {
  delta_x: number
  delta_y: number
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

export type DrawParameters = {
  canvas: HTMLCanvasElement
  filter?: string
  n?: number
  transformation?: ({ x, y }: Coordinate) => Coordinate
}

const Base: React.FC<Props> = ({
  canvas,
  configuration,
  matrix,
  width,
  height,
}) => {
  const dispatch = useDispatch()

  const dataFormat = useSelector(() => configuration[DATA_FORMAT])
  const m = useSelector(() => matrix[M])
  const n = useSelector(() => matrix[N])
  const points = useSelector(() => canvas[POINTS])
  const timestamps = useSelector(() => canvas[TIMESTAMPS])

  const margin = 4
  const offset = (margin * (n - 2) / n + 2)
  const childHeight = height / n - offset
  const childWidth = width / n - offset

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [initialTime, setInitialTime] = useState(Date.now())
  const [time, setTime] = useState<number>(0)
  const [isPainting, setIsPainting] = useState(false)
  const [erase, setErase] = useState(false)
  const [plane, setPlane] = useState<PlaneID>(SEGMENT)
  // const [sheepSelection, setSheepSelection] = useState<number>(0)
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const [isSurveyOpen, setIsSurveyOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined)
  const [originalMousePosition, setOriginalMousePosition] = useState<Coordinate | undefined>(undefined)

  const rowStyles = {
    flexDirection: ROW,
    ml: 2,
    mb: 1
  } as const

  const actionStyles = {
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

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return
    }

    const canvas: HTMLCanvasElement = canvasRef.current

    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    }
  }

  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef || !canvasRef.current)
      return

    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')

    const { x: xMoveTo, y: yMoveTo } = originalMousePosition
    const { x: xLineTo, y: yLineTo } = newMousePosition

    if (!!context) {
      Object.assign(context, {
        lineJoin: 'round',
        lineWidth: 0.8,
        strokeStyle: BLACK
      })

      context.beginPath()
      context.moveTo(xMoveTo, yMoveTo)
      context.lineTo(xLineTo, yLineTo)
      context.stroke()
    }
  }

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event)

    if (!!coordinates) {
      setIsPainting(true)
      setMousePosition(coordinates)
      console.log("start paint from sketch")
    }
  }, [])


  const paint = useCallback((event: MouseEvent) => {
    if (isPainting) {
      const now = Date.now()
      const ignorePoint = timestamps.length === 0 ? false : (now - (timestamps[timestamps.length - 1] as unknown as number)) < 100

      const newMousePosition = getCoordinates(event)

      if (!ignorePoint && !!mousePosition && !!newMousePosition) {
        dispatch(addPoint(newMousePosition))
        dispatch(addTimestamp(now))

        if (points.length > 1) {
          //drawLine(mousePosition, newMousePosition)
        }

        setMousePosition(newMousePosition)
        setOriginalMousePosition(mousePosition)
      }
    }
  }, [isPainting, mousePosition])

  const exitPaint = useCallback(() => {
    console.log("mouse up from sketch")
    setIsPainting(false)
  }, [])

  useEffect(() => {
    setTime((Date.now() - initialTime) / 1000)
  }, [points])

  // Add back for sheep replay functionality
  // useEffect(() => {
  //   eraseSketch()

  //   if (!canvasRef || !canvasRef.current)
  //     return

  //   const canvas: HTMLCanvasElement = canvasRef.current
  //   const context = canvas.getContext('2d')

  //   const data = electric_sheep[sheepSelection]

  //   if (!!context) {
  //     Object.assign(context, {
  //       lineJoin: 'round',
  //       lineWidth: 0.3,
  //       strokeStyle: "rgba(0, 0, 0, 0.1)"
  //     })


  //     data.forEach((datum, index) => {
  //       const prevPoint = data[index > 0 ? index - 1 : 0]
  //       const newMousePosition = {
  //         x: Math.floor(datum.x),
  //         y: Math.floor(datum.y)
  //       }
  //       const mousePosition = {
  //         x: Math.floor(prevPoint.x),
  //         y: Math.floor(prevPoint.y)
  //       }

  //       setTimeout(() => {
  //         setMousePosition(newMousePosition)
  //         setOriginalMousePosition(mousePosition)
  //         dispatch(addPoint(mousePosition))

  //         context.beginPath()
  //         context.moveTo(mousePosition.x, mousePosition.y)
  //         context.lineTo(newMousePosition.x, newMousePosition.y)
  //         context.closePath()
  //         context.stroke()

  //       }, index * 20)
  //     })


  //   }
  // }, [sheepSelection])

  useEffect(() => {
    if (!canvasRef.current)
      return

    const canvas: HTMLCanvasElement = canvasRef.current
    canvas.addEventListener('mousedown', startPaint)

    return () => {
      canvas.removeEventListener('mousedown', startPaint)
    }
  }, [startPaint])

  useEffect(() => {
    if (!canvasRef.current)
      return

    const canvas: HTMLCanvasElement = canvasRef.current
    canvas.addEventListener('mousemove', paint)

    return () => {
      canvas.removeEventListener("mousemove", paint)
    }
  }, [paint])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas: HTMLCanvasElement = canvasRef.current

    canvas.addEventListener("mouseup", exitPaint)
    canvas.addEventListener("mouseleave", exitPaint)

    return () => {
      canvas.removeEventListener("mouseup", exitPaint)
      canvas.removeEventListener("mouseleave", exitPaint)
    }
  }, [exitPaint])

  const eraseSketch = useCallback(() => {

    setInitialTime(Date.now())
    setTime(0)
    eraseCanvas(canvasRef)
    setErase(true)
    dispatch(resetData())
  }, [])

  useEffect(() => {
    setErase(false)
  }, [erase])

  const closeConfiguration = useCallback(() => {
    setIsConfigurationOpen(false)
  }, [])

  const closeSurvey = useCallback(() => {
    setIsSurveyOpen(false)
  }, [])

  const downloadDataPoints = useCallback((dataFormat: number) => {
    let csvContent = `data:text/csv;charset=utf-8,`

    // const singles = points.reduce((acc, point, index) =>
    //   `${acc}${point.x}, ${point.y}, ${timestamps[index]}\n`, '')

    const deltas = points.reduce((acc, val, index) => {
      if (index !== 0 && index !== points.length) {
        const currentPoint = val
        const prevPoint = points[index - 1]
        const timestamp = timestamps[index]

        acc = `${acc}${currentPoint.x - prevPoint.x}, ${currentPoint.y - prevPoint.y}, ${timestamp}\n`
      }

      return acc
    }, '')

    const encodedUri = encodeURI(`${csvContent}${deltas}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "deltas.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  }, [points, timestamps])

  const ACTIONS = [
    {
      id: "Survey",
      fx: () => { setIsSurveyOpen(!isSurveyOpen) }
    },
    {
      id: "Configure",
      fx: () => { setIsConfigurationOpen(!isConfigurationOpen) }
    },
    {
      id: "Erase",
      fx: eraseSketch
    },
    {
      id: "Download",
      fx: () => { downloadDataPoints(dataFormat) }
    }
  ]

  const singleMappedProps = {
    erase,
    height,
    width,
    margin,
    mousePosition,
    originalMousePosition
  }

  const canvasProps = {
    erase,
    height: childHeight,
    width: childWidth,
    margin,
    mousePosition,
    scalingFactor: m,
    originalMousePosition
  }

  const ARRAY_M = [...Array(m)]

  return <>
    < SlidingPane
      title={
        < Text {...defaultFontProps}>
          {CONFIGURATION}
        </Text >
      }
      isOpen={isConfigurationOpen}
      closeIcon={< FontAwesomeIcon icon="times" />}
      onRequestClose={closeConfiguration}
      width="800px"
    >
      <Configuration />
    </SlidingPane >

    < SlidingPane
      title={
        <Text {...defaultFontProps}>
          {SURVEY}
        </Text >
      }
      isOpen={isSurveyOpen}
      closeIcon={< FontAwesomeIcon icon="times" />}
      onRequestClose={closeSurvey}
      width="800px"
    >
      <Survey />
    </SlidingPane >

    {
      ACTIONS.map((action) =>
        <Button
          key={action.id}
          onClick={action.fx}
          {...defaultFontProps}
          bg="gray"
          mb={3}
          mr={2}
          sx={actionStyles}
        >{action.id}</Button>
      )
    }

    < Plane
      plane={plane}
      setPlane={setPlane}
      eraseSketch={eraseSketch}
    />

    {
      /* === SHEEP SELECTION === */
      /* <Box width="6rem" mr={3} mb={3}>
      <Select onChange={(event) => {
        setSheepSelection(event.target.value)
      }}>
        {
          [...Array(electric_sheep.length)].map((val, index) => <option>{index}</option>)
        }

      </Select>
    </Box> */}

    <Flex
      alignItems="flex-start"
      flexDirection={[COLUMN, COLUMN, ROW]}
      mb={3}
    >
      <Box>
        <SurveyCanvas 
          canvasRef={canvasRef}
          stylize={plane === SURVEY_CANVAS}
          erase={erase}
          isPainting={isPainting}
          height={height}
          width={width}
          margin={margin}
        />
        <Timer time={time} />

      </Box>
      

      {/* {plane === AVERAGE &&
        <Average
          {...singleMappedProps}
        />
      } */}

      {plane === CANVAS &&
        <>
          <Flex flexDirection={COLUMN} >
            {ARRAY_M.map((_, mIndex) =>
              <Flex
                {...rowStyles}
                key={mIndex}
              >
                {[...Array(n)].map((_, nIndex) =>
                  <Canvas
                    {...canvasProps}
                    key={mIndex * m + nIndex}
                    index={mIndex * m + nIndex}
                    direction={X}
                    waveStyle={SIN}
                  />
                )}
              </Flex>
            )}

            {ARRAY_M.map((_, mIndex) =>
              <Flex {...rowStyles}
                key={mIndex}
              >
                {[...Array(n)].map((_, nIndex) =>
                  <Canvas
                    {...canvasProps}
                    key={mIndex * m + nIndex}
                    index={mIndex * m + nIndex}
                    direction={Y}
                    waveStyle={SIN}
                  />
                )}
              </Flex>
            )}
          </Flex>

          <Flex flexDirection={COLUMN} >
            {ARRAY_M.map((_, mIndex) =>
              <Flex {...rowStyles}
                key={mIndex}
              >
                {[...Array(n)].map((_, nIndex) =>
                  <Canvas
                    {...canvasProps}
                    key={mIndex * m + nIndex}
                    index={mIndex * m + nIndex}
                    direction={X}
                    waveStyle={COS}
                  />
                )}
              </Flex>
            )}

            {ARRAY_M.map((_, mIndex) =>
              <Flex {...rowStyles}
                key={mIndex}
              >
                {[...Array(n)].map((_, nIndex) =>
                  <Canvas
                    {...canvasProps}
                    key={mIndex * m + nIndex}
                    index={mIndex * m + nIndex}
                    direction={Y}
                    waveStyle={COS}
                  />
                )}
              </Flex>
            )}
          </Flex>
        </>
      }

      {
        plane === SEGMENT &&
        <Flex flexDirection={COLUMN} >
          {ARRAY_M.map((_, mIndex) =>
            <Flex
              key={mIndex}
              flexDirection={ROW}
              ml={2}
              mb={1}
            >
              {[...Array(n)].map((_, nIndex) =>
                <Segment
                  key={mIndex * m + nIndex}
                  erase={erase}
                  height={childHeight}
                  width={childWidth}
                  margin={margin}
                  index={mIndex * m + nIndex}
                  mousePosition={mousePosition}
                  scalingFactor={m}
                  originalMousePosition={originalMousePosition}
                />
              )}
            </Flex>
          )}
        </Flex>
      }

      {
        plane === SHAPE &&
        <Shape
          {...singleMappedProps}
        />
      }

      {
        plane === CANVAS_GENERATIVE &&
        <Flex flexDirection={COLUMN} >
          {ARRAY_M.map((_, mIndex) =>
            <Flex
              key={mIndex}
              flexDirection={ROW}
              ml={2}
              mb={1}
            >
              {[...Array(n)].map((_, nIndex) =>
                <SketchChild
                  key={mIndex * m + nIndex}
                  erase={erase}
                  height={childHeight}
                  width={childWidth}
                  margin={margin}
                  index={mIndex * m + nIndex}
                  mousePosition={mousePosition}
                  scalingFactor={m}
                  originalMousePosition={originalMousePosition}
                />
              )}
            </Flex>
          )}
        </Flex>
      }
    </Flex>
  </>
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const Sketch = connector(Base)