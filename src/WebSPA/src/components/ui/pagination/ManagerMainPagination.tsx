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
	AiFillBackward,
	AiFillForward,
	AiOutlineEllipsis,
} from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components
import { ManagerURLAddForm, SearchInputField } from "@/components/forms";
// Assets

// Types
import { FilterBookmarksEnum } from "@/shared/types/global.types";
// General
import React, { useState, useEffect, ReactElement } from "react";
import { useStore } from "@/store/UseStore";

type TPagButtonProps = {
	children?: React.ReactNode;
	active?: boolean;
};

const PagButton = ({ active, children }: TPagButtonProps) => {
	return (
		<Button
			mx={1}
			px={4}
			py={2}
			rounded="md"
			bg={active ? "gray.800" : "gray.700"}
			_dark={{
				bg: "gray.800",
			}}
			color="gray.700"
			_hover={
				active
					? {
							bg: "brand.600",
							color: "white",
					  }
					: {}
			}
		>
			{children}
		</Button>
	);
};

type TMoreButtonProps = {
	left?: boolean;
	right?: boolean;
};

const MoreButton = ({ left, right }: TMoreButtonProps) => {
	const DoubleArrow = left ? AiFillBackward : AiFillForward;
	const [isHovering, setIsHovering] = useState(false);

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	return (
		<Button
			w={8}
			py={2}
			color="gray.700"
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
			cursor="pointer"
			textAlign="center"
		>
			{isHovering ? (
				<Icon as={DoubleArrow} boxSize={3} cursor="pointer" color="brand.700" />
			) : (
				<Icon
					as={AiOutlineEllipsis}
					color="gray.200"
					boxSize={4}
					opacity={0.5}
				/>
			)}
		</Button>
	);
};

type TManagerMainPaginationProps = {
	total: number;
};

export const ManagerMainPagination = ({
	total,
}: TManagerMainPaginationProps): React.ReactElement => {
	// Hooks
	const [pagesQuantity, setPagesQuantity] = useState(0);
	//const [currentPage, setCurrentPage] = useState(0);
	const { managerSlice } = useStore();

	useEffect(() => {
		// console.log(Math.ceil(total / managerSlice.getBookmarkParams.pageLimit));
		setPagesQuantity(
			Math.ceil(total / managerSlice.getBookmarkParams.pageLimit)
		);
	}, [total]);

	// Handlers
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const generatePagesButtons = () => {
    const currentPage = managerSlice.getBookmarkParams.page;
		let lowerLimit = currentPage - 4 === 1 ? 1 : currentPage - 4;
		let upperLimit = currentPage + 4 > pagesQuantity ? pagesQuantity : currentPage + 4;
    let arrSize = 1;//upperLimit - 9 !== 0 ? 9 : 

		// 1
		// 12
		// 123
		// 1234
		// 12345
    // 123456
		// 1234567

		// 1   2   3 4 ... 8

		// 123456789

		// 10 ... 12 13   14   15 16 ... 18

		while (arrSize < 9 &&
			arrSize + lowerLimit <= upperLimit) {
			arrSize++;
		}
     
		const pagesArr = [...Array(arrSize).keys()].map(i => i + lowerLimit);
		const pagesButtons : ReactElement[] = pagesArr.map(page => {
      
		});



		return (

		)
	}

	return (
		<Flex
			bg="#edf3f8"
			p={50}
			w="full"
			alignItems="center"
			justifyContent="center"
		>
			{
				generatePagesButtons()
			}
				<PagButton>
					<Icon as={AiFillBackward} color="gray.700" boxSize={4} />
					<Text>Previous Page</Text>
				</PagButton>
				<PagButton>1</PagButton>
				<MoreButton left />
				<PagButton>5</PagButton>
				<PagButton>6</PagButton>
				<PagButton active>7</PagButton>
				<PagButton>8</PagButton>
				<PagButton>9</PagButton>
				<MoreButton right />
				<PagButton>50</PagButton>
				<PagButton>
					<Text>Next Page</Text>
					<Icon as={AiFillForward} color="gray.700" boxSize={4} />
				</PagButton>
		</Flex>
	);
};
