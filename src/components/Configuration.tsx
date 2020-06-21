import React from 'react'
import {
  connect,
  ConnectedProps,
  useDispatch,
  useSelector
} from 'react-redux'
import {
  Box,
  Flex,
  Text
} from 'rebass'
import {
  Label,
  Input
} from '@rebass/forms'

import {
  Matrix,
  Module,
  Transformations,
} from './'

import {
  AMPLITUDE,
  ANCHOR_POINT,
  COLUMN,
  DATA_FORMAT,
  DELAY,
  DEFAULT_CONFIG,
  FREQUENCY,
  NUM_SEGMENTS,
  NUMBER,
  X,
  Y,
  ROW,
  TRANSFORMATIONS,
} from '../constants'
import {
  setX,
  setY,
  setAmplitude,
  setFrequency,
  setDelay,
  // setDistance,
  // setNumLines,
  setSegments,
  setDataFormat
} from '../actions'

import {
  defaultFontProps,
  GRAY,
} from '../styling'
import { State } from '../reducers'

type Props = {} & ConnectedProps<typeof connector>

export const Base: React.FC<Props> = ({ configuration }) => {
  const dispatch = useDispatch()

  const ANCHOR_POINT_CONFIG = [{
    id: X,
    action: setX,
    value: useSelector(() => configuration[X])
  }, {
    id: Y,
    action: setY,
    value: useSelector(() => configuration[Y])
  }] as const

  const DEFAULT_CONFIG_OPTIONS = [{
    id: AMPLITUDE,
    action: setAmplitude,
    value: useSelector(() => configuration[AMPLITUDE])
  }, {
    id: FREQUENCY,
    action: setFrequency,
    value: useSelector(() => configuration[FREQUENCY])
  }, {
    id: DELAY,
    action: setDelay,
    value: useSelector(() => configuration[DELAY])
  }, {
    id: NUM_SEGMENTS,
    action: setSegments,
    value: useSelector(() => configuration[NUM_SEGMENTS])
  }, {
    id: DATA_FORMAT,
    action: setDataFormat,
    value: useSelector(() => configuration[DATA_FORMAT]),
  }]

  // const TRANSFORMATION_OPTIONS = [{
  //   id: DISTANCE,
  //   action: setDistance,
  //   value: useSelector(() => transformation[DISTANCE]),

  // }]

  return <Box
    display={["none", "none", "block"]}
    ml={3} width="100%">
    <Module
      defaultVisibility
      heading={DEFAULT_CONFIG}
    >
      <Flex
        flexDirection={[COLUMN, COLUMN, ROW]}
        justifyContent="space-between"
        mb={3}
      >
        <Text
          {...defaultFontProps}
          py={2}
        >
          {ANCHOR_POINT}
        </Text>

        <Flex
          alignItems="center"
          flexDirection={ROW}
        >
          ({ANCHOR_POINT_CONFIG.map((anchor, index) =>
          <Label
            key={anchor.id}
            htmlFor={anchor.id}
            width="6rem"
          >
            <Input
              name={anchor.id}
              min={0}
              type={NUMBER}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(anchor.action(parseInt(e.target.value, 10)))
              }}
              mx={2}
              sx={{
                borderColor: GRAY,
                borderRadius: "5px"
              }}
              value={anchor.value}
            />
            {index === 0 ? <Flex
              alignSelf="flex-end"
              pb={2}
            >,</Flex> : null}
          </Label>
        )})
        </Flex>
      </Flex>

      <Matrix />

      {DEFAULT_CONFIG_OPTIONS.map((config, index) =>
        <Flex flexDirection={ROW}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Text
            {...defaultFontProps}
            py={2}
          >
            {config.id}
          </Text>
          <Label
            key={config.id}
            htmlFor={config.id}
            width="6rem"
          >
            <Input
              name={config.id}
              min={0}
              type={NUMBER}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(config.action(parseInt(e.target.value, 10)))
              }}
              mx={2}
              sx={{
                borderColor: GRAY,
                borderRadius: "5px"
              }}
              value={config.value}
            />
          </Label>
        </Flex>
      )}

    </Module>

    <Module
      defaultVisibility
      heading={TRANSFORMATIONS}
    >
      <Transformations />
    </Module>
  </Box >
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const Configuration = connector(Base)