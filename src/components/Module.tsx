
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SlideDown } from 'react-slidedown'
import {
  Box,
  Button,
  Flex,
  Heading,
} from 'rebass'
import {
  defaultFontProps,
  BLACK,
  GRAY,
} from '../styling'

type Props = {
  heading: string
  defaultVisibility?: boolean
}

export const Module: React.FC<Props> = ({
  children,
  defaultVisibility = false,
  heading
}) => {

  const [isVisible, setIsVisible] = useState(defaultVisibility)

  return <Box
    mb={3}
    sx={{
      borderBottomStyle: "solid",
      borderBottomColor: GRAY,
      borderBottomWidth: "1px"
    }}
  >
    <Flex
      alignItems="center"
      justifyContent="space-between"
    >
      <Heading
        {...defaultFontProps}
        color={isVisible ? BLACK : GRAY}
        py={3}
        fontSize={2}
        sx={{
          transition: "0.15s ease-in"
        }}
      >
        {heading}
      </Heading>
      <Button
        onClick={() => { setIsVisible(!isVisible) }}
        color={GRAY}
        height="fit-content"
        px={2}
        py={0}
        sx={{
          ':hover': {
            color: BLACK,
            cursor: 'pointer',
            transition: "0.3s ease-in"
          }
        }}
      >
        <FontAwesomeIcon
          icon={isVisible ? "angle-up" : "angle-down"}
        />
      </Button>
    </Flex>

    <SlideDown className="my-dropdown-slidedown">
      {isVisible && <Box>
        {children}
      </Box>}
    </SlideDown>
  </Box>

}
