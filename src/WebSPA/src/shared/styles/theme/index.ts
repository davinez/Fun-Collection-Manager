/***** Main Chakra custom theme entrypoint *****/
import { extendTheme } from "@chakra-ui/react";

// Foundational style overrides
import colors  from "shared/styles/theme/foundations/colors";
import textStyles from "shared/styles/theme/foundations/textStyles";
import { Icon } from "shared/styles/theme/components/icon";

// Component style overrides
//import { Button } from "./components/button";

const overrides = {
	// Foundational style overrides go here
	...colors,
	...textStyles,
	// Components overrides go here
	components: {
	// 	Button,
	Icon
	 },
};

// More Info for styling component none existing in Chakra UI https://chakra-ui.com/docs/styled-system/component-style#styling-single-part-components

export default extendTheme(overrides);

