// Design
import {
	FormControl,
	FormLabel,
	Textarea,
	FormErrorMessage,
	TextareaProps,
} from "@chakra-ui/react";
// Components

// Assets

// Hooks

// Types

// General
import { useFormContext } from "react-hook-form";

type TTextAreaFieldProps = {
	id: string;
	label?: string;
	errorMessage?: string;
};

export const TextAreaField = ({
	id,
	label,
	errorMessage,
	fontSize,
	...rest
}: TTextAreaFieldProps & TextareaProps) => {
	const { control, register } = useFormContext(); // retrieve all hook methods

	return (
		// <FormControl>
		// 	<FormLabel htmlFor={id}>{label}</FormLabel>
		// 	<Controller
		// 		control={control}
		// 		name={"newURL"}
		// 		render={({ field }) => <Input id={id} {...rest} />}
		// 	/>
		// 	<FormErrorMessage>{errorMessage}</FormErrorMessage>
		// </FormControl>
		<FormControl isInvalid={errorMessage !== undefined}>
			{label && (
				<FormLabel htmlFor={id} fontSize={fontSize}>
					{label}
				</FormLabel>
			)}
			<Textarea id={id} fontSize={fontSize} {...register(id)} {...rest} />
			<FormErrorMessage>{errorMessage}</FormErrorMessage>
		</FormControl>
	);
};
