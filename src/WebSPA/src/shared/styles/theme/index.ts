/***** Main Chakra custom theme entrypoint *****/

import { extendTheme } from "@chakra-ui/react";

// Foundational style overrides
//import borders from './foundations/borders'

// Component style overrides
import { Button } from './components/button'

const overrides = {
  // Foundational style overrides go here
  //borders,
  // Components overrides go here
  components: {
    Button,

  }
}

// More Info for styling component none existing in Chakra UI https://chakra-ui.com/docs/styled-system/component-style#styling-single-part-components

export const customChakraUITheme = extendTheme(overrides)


// const myCustomTheme = {
//   // Color palette
//   colors: {
//     primary: "#FF5733",
//     secondary: "#3498db",
//     // Add more custom colors here
//   },
//   // Fonts
//   fonts: {
//     body: "Arial, sans-serif",
//     heading: "Georgia, serif",
//     // Add more custom fonts here
//   },
//   // Font sizes
//   fontSizes: {
//     xs: "12px",
//     sm: "14px",
//     md: "16px",
//     // Add more custom font sizes here
//   },
//   // Spacing
//   space: {
//     xs: "4px",
//     sm: "8px",
//     md: "16px",
//     // Add more custom spacing values here
//   },
//   // Components
//   components: {
//     Button: {
//       // Customize the Button component here
//     },
//     Input: {
//       // Customize the Input component here
//     },
//     // Add more customized components here
//   },
// };

