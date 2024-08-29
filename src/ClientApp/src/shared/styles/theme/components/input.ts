import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
// Custom
import colorsTheme from 'shared/styles/theme/foundations/colors'
import textStylesTheme from 'shared/styles/theme/foundations/textStyles'

const bgColor = colorsTheme.colors.brandPrimary[950];
const fontColor = colorsTheme.colors.brandPrimary[100];
const fontSize = textStylesTheme.textStyles.primary.fontSize;

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const navbar = definePartsStyle({
  field: {
    background: `${bgColor}`,
    color: `${fontColor}`,
    fontSize: `${fontSize}`,
    h: 'auto'
  },
  addon: {
    background: `${bgColor}`,
    color: `${fontColor}`,
    fontSize: `${fontSize}`,
    h: 'auto'
  },
  element: {
    background: `${bgColor}`,
    color: `${fontColor}`,
    fontSize: `${fontSize}`,
    h: 'auto'
  }
})

export const inputTheme = defineMultiStyleConfig({
  variants: { navbar },
})
