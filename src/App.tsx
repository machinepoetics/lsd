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
  Flex
} from 'rebass'

import {
  Sketch
} from './components'
import { defaultFontProps } from './styling'

import { TITLE } from './survey'

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
<>
<Flex height="100%">
<Box width="40%" marginTop="25px">
<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdaCCk0ugceOjbN3NpCc0rzHoJ-LScOKHj3vWb150C5yWdXUg/viewform?embedded=true" width="100%" height="100%" frameBorder="0">Loading…</iframe>
</Box>
<Box px={3} width="60%" padding="0" style={{position: 'relative'}}> 
    <Heading
      mb={3}
      {...defaultFontProps}
      fontSize={4}
      letterSpacing="0.1em"
      textAlign="center"
    >{TITLE}</Heading>

    <Sketch
      height={600}
      width={600}
    />
  </Box >

</Flex>


  
</>


export default connect()(App)