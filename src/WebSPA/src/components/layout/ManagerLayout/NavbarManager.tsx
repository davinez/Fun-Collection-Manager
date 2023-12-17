// Design
import {
	Icon,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Input,
	Button,
	ButtonGroup,
	Stack,
	Menu,
	MenuList,
	MenuButton,
	MenuItem,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
} from "@chakra-ui/react";
import {
	AiFillCaretDown,
	AiOutlineSearch,
	AiFillFilter,
	AiFillStar,
} from "react-icons/ai";
import textStylesTheme from "shared/styles/theme/foundations/textStyles";
import colorStylesTheme from "shared/styles/theme/foundations/colors";
// Components
import { InputField } from "components/forms";
// Assets

// Hooks
import { useDisclosure } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Types
import type { TAddURLPayload } from "@/shared/types/api/manager.types";
// General

const validationSchema = z.object({
	url: z
		.string()
		.min(11, { message: "URL address is required" })
		.url({ message: "Must be a valid url address" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const AddURLForm = () => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<TAddURLPayload>();

	const onSubmit: SubmitHandler<TAddURLPayload> = (): void => {};

	return (
		<Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
			<InputField label="URL" id="new-url" />
			<Button
				isDisabled
				bg="brandSecondary.600"
				_hover={{
					bg: "brandSecondary.800",
				}}
			>
				Save
			</Button>
		</Stack>
	);
};

export const NavbarManager = (): React.ReactElement => {

	return (
		<>
			<InputGroup
				aria-label="page-navbar-leftbuttons-div"
				h="55%"
				w={{
					base: "80%",
					md: "40%",
				}}
			>
				<InputLeftElement h="100%">
					<Icon as={AiOutlineSearch} boxSize="80%" color="brandPrimary.150" />
				</InputLeftElement>

				<Input variant="navbar" placeholder="Search" />

				<InputRightElement h="100%">
					<Menu placement="bottom-end">
						<MenuButton
							_hover={{
								bg: "brandPrimary.800",
							}}
							as={Button}
							bg={colorStylesTheme.colors.brandPrimary[950]}
							p="5px"
							w="100%"
							h="100%"
							rightIcon={
								<Icon
									boxSize={textStylesTheme.textStyles.primary.fontSize}
									as={AiFillCaretDown}
									color="brandPrimary.150"
								/>
							}
						>
							<Icon
								boxSize={textStylesTheme.textStyles.primary.fontSize}
								as={AiFillFilter}
								color="brandPrimary.150"
							/>
						</MenuButton>
						<MenuList
							bg="brandPrimary.800"
							color="brandPrimary.100"
							border="none"
						>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
							>
								Link 1
							</MenuItem>
							<MenuItem
								bg="brandPrimary.800"
								_hover={{
									bg: "brandSecondary.800",
								}}
							>
								Link 2
							</MenuItem>
						</MenuList>
					</Menu>
				</InputRightElement>
			</InputGroup>

			<Popover
				placement="bottom-end"
			>
				<PopoverTrigger>
					<Button
						fontSize={textStylesTheme.textStyles.primary.fontSize}
						bg="brandSecondary.600"
						_hover={{
							bg: "brandSecondary.800",
						}}
						px={3}
						py={3}
						h="55%"
						leftIcon={<Icon boxSize="120%" as={AiFillStar} color="black" />}
					>
						Add
					</Button>
				</PopoverTrigger>
				<PopoverContent p={5}>
					<PopoverArrow />
					<PopoverCloseButton />
					<AddURLForm />
				</PopoverContent>
			</Popover>
		</>
	);
};
