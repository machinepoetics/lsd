import React from 'react'
import { Flex } from 'rebass'
import { Checkbox, Label } from '@rebass/forms'
import {
  CANVAS,
  CANVAS_GENERATIVE,
  NONE,
  SEGMENT,
  ROW,
  SURVEY_CANVAS
} from '../constants'
import { Plane as PlaneID, ValueOf } from '../types'
import { defaultFontProps } from '../styling'
import { useEffect } from 'react'

const PLANES = [
  NONE,
  SEGMENT,
  // AVERAGE
  CANVAS,
  CANVAS_GENERATIVE,
  SURVEY_CANVAS
] as const

type TPlane = typeof PLANES

type Props = {
  plane: ValueOf<TPlane>
  setPlane: (plane: PlaneID) => void
  eraseSketch: () => void
}

export const Plane: React.FC<Props> = ({
  plane: currentPlane,
  setPlane,
  eraseSketch
}) => 
  <Flex
    flexDirection={ROW}
    alignItems="center"
    justifyContent="flex-start"
    pb={3}
  >
    {PLANES.map((plane) =>
      <Label
        key={plane}
        {...defaultFontProps}
        display="flex"
        alignItems="center"
        flexDirection="row"
        mr={2} width="fit-content">
        <Checkbox
          onChange={() => {
            setPlane(plane)
            eraseSketch()
          }}
          {...defaultFontProps}
          checked={currentPlane === plane}
        />
        {plane}
      </Label>
    )}
  </Flex>
