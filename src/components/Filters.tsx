import React from 'react'

import { Box } from 'rebass'
import { Label, Select } from '@rebass/forms'
import {
  FILTER,

  // FILTER TYPES
  BLUR,
  BRIGHTNESS,
  CONTRAST,
  DROP_SHADOW,
  GRAYSCALE,
  HUE_ROTATION,
  INVERT,
  OPACITY,
  SATURATE,
  SEPIA,
  URL
} from '../constants'
import { GRAY } from '../styling'
import { ValueOf } from '../types'

const FILTERS = [
  {
    id: BLUR,
    fx: () => { }
  }, {
    id: BRIGHTNESS,
    fx: () => { }
  }, {
    id: CONTRAST,
    fx: () => { }
  }, {
    id: DROP_SHADOW,
    fx: () => { }
  }, {
    id: GRAYSCALE,
    fx: () => { }
  }, {
    id: HUE_ROTATION,
    fx: () => { }
  }, {
    id: INVERT,
    fx: () => { }
  }, {
    id: OPACITY,
    fx: () => { }
  }, {
    id: SATURATE,
    fx: () => { }
  }, {
    id: SEPIA,
    fx: () => { }
  }, {
    id: URL,
    fx: () => { }
  }
] as const;

export type Filter = ValueOf<typeof FILTERS>


type Props = {

}

export const Filters: React.FC<Props> = ({

}) => {
  return <Box>
    <Label
      htmlFor={FILTER}
    />
    <Select
      name={FILTER}
      onChange={() => { }}
      mx={2}
      sx={{
        borderColor: GRAY,
        borderRadius: "5px"
      }}
      value={''}
    >
      {FILTERS.map((filter, index) =>
        <option>{filter.id}</option>
      )}
    </Select>

  </Box>

}