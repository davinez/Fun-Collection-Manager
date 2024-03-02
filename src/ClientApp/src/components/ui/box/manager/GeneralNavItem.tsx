// Design
import {
	Text,
	Flex,
	Icon,
	type FlexProps,
} from "@chakra-ui/react";
// Components

// Assets

// Hooks

// Types


// General


type TGeneralNavItemProps = {
	icon: React.ElementType; // Third party icon
	counter: number;
	children: React.ReactNode;
	handleOnClickNavItem?: () => void;
};

export const GeneralNavItem = ({
	icon,
	counter,
	children,
	handleOnClickNavItem,
	...rest
}: TGeneralNavItemProps & FlexProps): React.ReactElement => {
	return (
		<Flex
			align="center"
			justify="space-between"
			cursor="pointer"
			onClick={handleOnClickNavItem}
			{...rest}
		>
			<Flex
				w="85%"
				aria-label="navitem-left-section"
				align="center"
				gap={0}
				p={0}
			>
				<Icon
					ml="0px"
					mr="5px"
					boxSize="5"
					color="brandPrimary.150"
					as={icon}
				/>
				<Text
					aria-label="navitem-name"
					wordBreak="break-all"
					overflow="hidden"
					textOverflow="ellipsis"
					sx={{
						display: "-webkit-box",
						WebkitLineClamp: 1,
						WebkitBoxOrient: "vertical",
					}}
				>
					{children}
				</Text>
			</Flex>
			<Text
				aria-label="navitem-right-section"
				textStyle="tertiary"
				color="brandPrimary.150"
				w="15%"
				textAlign="end"
				mr={1}
			>
				{counter}
			</Text>
		</Flex>
	);
};
