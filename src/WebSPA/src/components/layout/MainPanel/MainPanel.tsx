import { Box, useStyleConfig, type ThemingProps, type BoxProps } from "@chakra-ui/react";

// function generic and type props explicitly.
type TMainPanelProps = {
	children: React.ReactNode;
};

export default function MainPanel <T extends string>({variant, children, ...rest}: TMainPanelProps & ThemingProps<T> & BoxProps): React.ReactElement {

  // https://chakra-ui.com/docs/styled-system/component-style#consuming-style-config
  // Used to created a Chakra component
	const styles = useStyleConfig("MainPanel", { variant });

	// Pass the computed styles into the `__css` prop
	return (
		<Box __css={styles} {...rest}>
			{children}
		</Box>
	);
}
