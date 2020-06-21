import React from 'react'
import { Box, Button, Flex, Heading, Text } from 'rebass'
import { defaultFontProps, theme } from '../styling'

export const BUTTON = "button"
export const GRID = "grid"

const GRAY = theme.colors.grey[0]

type Props = {
  active?: string
  header?: string
  items: any[]
  style: typeof BUTTON | typeof GRID
}

export const Menu: React.FC<Props> = ({
  active,
  header,
  items,
  style
}) =>
  <Box
    display="block"
    pt={[3, 0, 0]}
  >
    {header && <Heading
      {...defaultFontProps}
      letterSpacing="0.1em"
      mb={3}
      sx={{
        textTransform: "uppercase"
      }}
    >{header}</Heading>}

    <Flex
      flexWrap="wrap"
    >

      {style === GRID && items.map((item, index) =>
        <Box
          key={item.id}
          {...defaultFontProps}
          mb={3}
          mr={2}
          p={3}
          width={150}
          sx={{
            borderRadius: "3px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: GRAY,
            fontWeight: item.id === active ? "bold" : "normal"
          }}
        >

          <Text
            {...defaultFontProps}
            fontSize={1}
          >
            {item.id}
          </Text>
        </Box>
      )}

      {style === BUTTON && items.map((item, index) =>
        <Button
          key={item.id}
          {...defaultFontProps}
          bg="gray"
          mb={3}
          mr={2}
          sx={{
            borderColor: "transparent",
            borderStyle: "solid",
            borderWidth: "1px",
            ':hover': {
              background: "white",
              borderColor: GRAY,
              color: "black",
              cursor: "pointer",
              transition: "0.3s"
            }
          }}
        >{item.id}</Button>
      )}
    </Flex>
  </Box>