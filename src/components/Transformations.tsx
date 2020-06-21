import React from 'react'
import { Box } from 'rebass'
import {
  circle,
  cos,
  scale_x,
  scale_y,
  sin,
  square,
  tree
} from '../transformations'

type Props = {}

export const TRANSFORMATION_PRESETS = [
  scale_x,
  scale_y,
  // tree,
  // cos,
  // sin,
  // square,
  circle
] as const

export const Transformations: React.FC<Props> = () => {
  return <Box />
}