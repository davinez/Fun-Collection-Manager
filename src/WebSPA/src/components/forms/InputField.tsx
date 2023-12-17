// Design
import {
	FormControl,
	FormLabel,
	Input,
	type FormLabelProps,
	type InputProps,
} from "@chakra-ui/react";

// Components

// Assets

// Hooks

// Types

// General

type TInputFieldProps = {
	label: string;
};

export const InputField = ({
	id,
	label,
	...rest
}: TInputFieldProps & FormLabelProps & InputProps) => {
	return (
		<FormControl>
			<FormLabel htmlFor={id}>{label}</FormLabel>
			<Input id={id} {...rest} />
		</FormControl>
	);
};
