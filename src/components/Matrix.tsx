import React from 'react'
import {
  connect,
  ConnectedProps,
  useDispatch,
  useSelector
} from 'react-redux'

import { Flex, Text } from 'rebass'
import { Input, Label } from '@rebass/forms'

import { setM, setN } from '../actions'
import { defaultFontProps, GRAY } from '../styling'
import {
  COLUMN,
  NUMBER,
  MATRIX_DIMENSIONS,
  M,
  N,
  ROW
} from '../constants'
import { State } from '../reducers'

type Props = {} & ConnectedProps<typeof connector>

const Base: React.FC<Props> = ({ matrix }) => {

  const dispatch = useDispatch()

  const MATRIX_CONFIG = [{
    id: M,
    action: setM,
    value: useSelector(() => matrix[M])
  }, {
    id: N,
    action: setN,
    value: useSelector(() => matrix[N])
  }] as const

  return <Flex
    flexDirection={[COLUMN, COLUMN, ROW]}
    justifyContent="space-between"
    mb={3}
  >
    <Text
      {...defaultFontProps}
      py={2}
    >
      {MATRIX_DIMENSIONS}
    </Text>

    <Flex flexDirection={[COLUMN, COLUMN, ROW]}>
      {
        MATRIX_CONFIG.map(dim =>
          <Flex
            alignItems="center"
            flexDirection={ROW}
            justifyContent="flex-start"
            ml={[0, 0, 3]}
            mt={[2, 2, 0]}
            width="10rem"
          >
            <Label
              {...defaultFontProps}
              htmlFor={dim.id}
              pb={2}
              width="3rem"
            >
              {`${dim.id} =`}
            </Label>
            <Input
              name={dim.id}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(dim.action(parseInt(e.target.value, 10)))
              }}
              type={NUMBER}
              value={dim.value}
              sx={{
                borderColor: GRAY,
                borderRadius: "5px"
              }}
            />
          </Flex>
        )}
    </Flex>
  </Flex>
}

const mapState = (state: State) => state

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export const Matrix = connector(Base)
