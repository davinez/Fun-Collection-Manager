import { extendTheme } from "@chakra-ui/react";

import { config } from "./config";

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

export const theme = extendTheme({
  // fonts: {
  //   heading: "Plus Jakarta Sans, sans-serif",
  //   body: "Plus Jakarta Sans, sans-serif",
  // },
  // color: {
  //   brand: {
  //     900: '#1a365d',
  //     800: '#153e75',
  //     700: '#2a69ac',
  //   },
  // },
  components: {
    // Button: {
    // }
  },
  config,
});
