import React from 'react'
import { Text } from 'rebass'
import { defaultFontProps } from '../styling';

type Props = {
  time: number
}

export const Timer: React.FC<Props> = ({ time }) => {
  return <Text
    mt={3}
    {...defaultFontProps}
  >
    <strong>Time elapsed (s): </strong>
    {time.toString()}
  </Text>
}