import React from 'react'
import { Box, Text } from 'rebass'
import { Module } from './'
import { SURVEY } from '../constants'
import { defaultFontProps } from '../styling'

export const Survey: React.FC = () =>
  <Box>
    <Module
      heading={SURVEY}
      defaultVisibility
    >
      <Text {...defaultFontProps}>
        <ul>
          <li>{'placeholder question'}</li>
          <li>{'placeholder question'}</li>
          <li>{'placeholder question'}</li>
          <li>{'placeholder question'}</li>
          <li>{'placeholder question'}</li>
        </ul>
      </Text>
    </Module>

  </Box>