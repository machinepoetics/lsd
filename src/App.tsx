import React from 'react';
import { connect } from 'react-redux'
import { Formik } from 'formik'
// import { ChromePicker } from 'react-color'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faCircle,
  faEllipsisH,
  faExpandAlt,
  faRedo,
  faSlash,
  faSquare,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

import './App.css';
import 'react-slidedown/lib/slidedown.css'
import 'react-sliding-pane/dist/react-sliding-pane.css';

import {
  Box,
  Heading,
} from 'rebass'

import {
  Sketch
} from './components'
import { defaultFontProps } from './styling'

library.add(
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faCircle,
  faEllipsisH,
  faExpandAlt,
  faRedo,
  faSlash,
  faSquare,
  faTimes
)

const App: React.FC = () =>
  <Box px={3} width="100%">
    <Heading
      mb={3}
      {...defaultFontProps}
      fontSize={4}
      letterSpacing="0.1em"
      textAlign="center"
    >DRAWING TESTS</Heading>

    <Sketch
      height={600}
      width={600}
    />
  </Box >

export default connect()(App)