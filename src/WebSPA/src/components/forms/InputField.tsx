// Design
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	InputProps,
} from "@chakra-ui/react";
// Components

// Assets

// Hooks

// Types

// General
import { useFormContext } from "react-hook-form";

type TInputFieldProps = {
	id: string;
	label?: string;
	errorMessage?: string;
};

export const InputField = ({
	id,
	label,
	errorMessage,
	...rest
}: TInputFieldProps & InputProps) => {
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
			{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
			<Input id={id} {...register(id)} {...rest} />
			<FormErrorMessage>{errorMessage}</FormErrorMessage>
		</FormControl>
	);
};
