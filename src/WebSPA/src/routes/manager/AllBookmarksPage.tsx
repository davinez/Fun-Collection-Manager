// Design
import {
	Hide,
	Stack,
	Text,
	Box,
	Flex,
	Icon,
	CheckboxGroup,
	Checkbox,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	PopoverCloseButton,
	PopoverAnchor,
	RadioGroup,
	Radio,
	type FlexProps,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiFillCaretRight,
	AiFillFolder,
	AiOutlineUser,
	AiFillCloud,
	AiFillDelete,
	AiFillSetting,
	AiOutlineLogout,
	//
	AiFillClockCircle,
	AiFillChrome,
} from "react-icons/ai";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
// Components

// Assets

// Hooks
import { useGetCollectionsQuery } from "@/api/services/manager";
// Types
import type { TCollection } from "@/shared/types/api/manager.types";
import { FormActionEnum } from "@/shared/types/global.types";
// General
import { Fragment, useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { defaultHandlerApiError } from "@/api/apiClient";

type THeaderFiltersProps = {
	icon?: string | React.ElementType; // Third party icon
	headerName: string;
};

const HeaderFilters = ({ icon, headerName }: THeaderFiltersProps) => {
	const [value, setValue] = useState("1");
	const variable = "sgsf";

	return (
		<Flex>
			<Flex alignItems="center" gap={3}>
				<Icon mx="0px" boxSize="3" color="brandPrimary.150" as={AiFillCloud} />
				<Text textStyle="primary">{headerName}</Text>
			</Flex>

			<Flex justify="space-between" gap={2}>
				<Popover>
					<PopoverTrigger>
						<Button
							bg="brandPrimary.900"
							color="brandPrimary.100"
							_hover={{
								bg: "brandPrimary.950",
							}}
							_active={{
								bg: "brandPrimary.950",
							}}
						>
							<Icon
								mx="0px"
								boxSize="3"
								color="brandPrimary.150"
								as={AiFillClockCircle}
							/>
							<Hide below="md">
								<Text ml={1} textStyle="secondary" color="brandPrimary.150">
									{variable}
								</Text>
							</Hide>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						zIndex="popover"
						bg="brandPrimary.900"
						color="brandPrimary.100"
						border="1px solid"
						borderColor="brandPrimary.900"
						w="100%"
						p={2}
					>
						<PopoverBody>
							<RadioGroup onChange={setValue} value={value} defaultValue="2">
								<Stack direction="column">
									<Radio
										value="date-asc"
										colorScheme="gray"
										borderColor="brandPrimary.150"
										_focus={{
											borderColor: "none",
											outline: "none",
											boxShadow: "none",
										}}
										_hover={{
											borderColor: "brandPrimary.100",
											color: "brandPrimary.150",
										}}
									>
										<Flex align="center" gap={2}>
											<Icon
												boxSize="5"
												color="brandPrimary.100"
												as={AiFillClockCircle}
											/>
											<Text textStyle="primary" color="brandPrimary.100">
												By date Asc
											</Text>
										</Flex>
									</Radio>
									<Radio value="date-desc">By date Desc</Radio>
									<Radio value="name-asc">By name (A-Z)</Radio>
									<Radio value="name-desc">By name (Z-A)</Radio>
									<Radio value="sites-asc">Sites (A-Z)</Radio>
									<Radio value="sites-desc">Sites (Z-A)</Radio>
								</Stack>
							</RadioGroup>
						</PopoverBody>
					</PopoverContent>
				</Popover>

				<Box>
					<Icon
						mx="0px"
						boxSize="3"
						color="brandPrimary.150"
						as={AiFillCloud}
					/>
					<Hide below="md">
						<Text ml={1} textStyle="secondary" color="brandPrimary.150">
							This text hides at the "md" value screen width and smaller.
						</Text>
					</Hide>
				</Box>
			</Flex>
		</Flex>
	);
};

export const AllBookmarksPage = (): React.ReactElement => {
	const sortByDateAsc = () => {
		// Sort data response

		return (
			<Box>
				<Icon mx="0px" boxSize="3" color="brandPrimary.150" as={AiFillCloud} />
				<Hide below="md">
					<Text ml={1} textStyle="secondary" color="brandPrimary.150">
						This text hides at the "md" value screen width and smaller.
					</Text>
				</Hide>
			</Box>
		);
	};

	return (
		<>
			<HeaderFilters headerName="All bookmarks" />
			<Stack direction={["column", "row"]} spacing="24px">
				<Text>All</Text>
			</Stack>
		</>
	);
};
