// Design
import {
	Icon,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Input,
	Button,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	MenuOptionGroup,
	MenuItemOption,
	MenuDivider,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverCloseButton,
	PopoverBody,
	Spinner,
	Flex,
	Text,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiOutlineSearch,
	AiFillFilter,
	AiFillStar,
	AiFillDatabase,
	AiFillClockCircle,
	AiFillChrome,
} from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { ManagerURLAddForm, SearchInputField } from "@/components/forms";
// Assets

// Types
import { FilterBookmarksEnum } from "@/shared/types/global.types";
// General
import React, { useState } from "react";
import { useStore } from "@/store/UseStore";

type TPagButtonProps = {
	children?: React.ReactNode;
};

const PagButton = ({children} : TPagButtonProps) => {
	const activeStyle = {
		bg: "brand.600",
		_dark: {
			bg: "brand.500",
		},
		color: "white",
	};
	return (
		<Button
			mx={1}
			px={4}
			py={2}
			rounded="md"
			bg="white"
			_dark={{
				bg: "gray.800",
			}}
			color="gray.700"
			opacity={props.disabled && 0.6}
			_hover={!props.disabled && activeStyle}
			cursor={props.disabled && "not-allowed"}
			{...(props.active && activeStyle)}
		>
			{children}
		</Button>
	);
};

export const ManagerMainPagination = (): React.ReactElement => {

	const MButton = (props) => {
		const DoubleArrow = props.left ? ArrowLeftIcon : ArrowRightIcon;
		const [hovered, setHovered] = React.useState(false);
		const hoverColor = useColorModeValue("brand.800", "brand.700");
		const unHoverColor = useColorModeValue("gray.100", "gray.200");
		return (
			<chakra.a
				w={8}
				py={2}
				color="gray.700"
				_dark={{
					color: "gray.200",
				}}
				onMouseOver={() => setHovered(true)}
				onMouseOut={() => setHovered(false)}
				cursor="pointer"
				textAlign="center"
			>
				{hovered ? (
					<Icon
						as={DoubleArrow}
						boxSize={3}
						cursor="pointer"
						color={hoverColor}
					/>
				) : (
					<Icon
						as={HiDotsHorizontal}
						color={unHoverColor}
						boxSize={4}
						opacity={0.5}
					/>
				)}
			</chakra.a>
		);
	};

	return (
		<Flex
			bg="#edf3f8"
			_dark={{
				bg: "#3e3e3e",
			}}
			p={50}
			w="full"
			alignItems="center"
			justifyContent="center"
		>
			<Flex>
				<PagButton>
					<Icon
						as={IoIosArrowBack}
						color="gray.700"
						_dark={{
							color: "gray.200",
						}}
						boxSize={4}
					/>
				</PagButton>
				<PagButton>1</PagButton>
				<MButton left />
				<PagButton>5</PagButton>
				<PagButton>6</PagButton>
				<PagButton active>7</PagButton>
				<PagButton>8</PagButton>
				<PagButton>9</PagButton>
				<MButton right />
				<PagButton>50</PagButton>
				<PagButton>
					<Icon
						as={IoIosArrowForward}
						color="gray.700"
						_dark={{
							color: "gray.200",
						}}
						boxSize={4}
					/>
				</PagButton>
			</Flex>
		</Flex>
	);
};
