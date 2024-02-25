// Design
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	InputProps,
	useMergeRefs,
} from "@chakra-ui/react";
// Components

// Assets

// Hooks

// Types

// General
import { useFormContext } from "react-hook-form";
import React from "react";

type TInputFieldProps = {
	id: string;
	label?: string;
	errorMessage?: string;
};

// export const InputField = ({
// 	id,
// 	label,
// 	errorMessage,
// 	fontSize,
// 	...rest
// }: TInputFieldProps & InputProps) => {
// 	const { control, register } = useFormContext(); // retrieve all hook methods

// 	return (
// 		// <FormControl>
// 		// 	<FormLabel htmlFor={id}>{label}</FormLabel>
// 		// 	<Controller
// 		// 		control={control}
// 		// 		name={"newURL"}
// 		// 		render={({ field }) => <Input id={id} {...rest} />}
// 		// 	/>
// 		// 	<FormErrorMessage>{errorMessage}</FormErrorMessage>
// 		// </FormControl>
// 		<FormControl isInvalid={errorMessage !== undefined}>
// 			{label && (
// 				<FormLabel htmlFor={id} fontSize={fontSize}>
// 					{label}
// 				</FormLabel>
// 			)}
// 			<Input id={id} fontSize={fontSize} {...register(id)} {...rest}  />
// 			<FormErrorMessage>{errorMessage}</FormErrorMessage>
// 		</FormControl>
// 	);
// };

export const InputField = React.forwardRef<
	HTMLInputElement,
	TInputFieldProps & InputProps
>(({ id, label, errorMessage, fontSize, ...rest }, refChakra) => {
	const { register } = useFormContext(); // retrieve all hook methods
	const { ref, ...restReactHookForm } = register(id);
	const refs = useMergeRefs(refChakra, ref);

	return (
		<FormControl isInvalid={errorMessage !== undefined}>
			{label && (
				<FormLabel htmlFor={id} fontSize={fontSize}>
					{label}
				</FormLabel>
			)}
			<Input
				id={id}
				fontSize={fontSize}
				ref={refs}
				{...restReactHookForm}
				{...rest}
			/>
			<FormErrorMessage>{errorMessage}</FormErrorMessage>
		</FormControl>
	);
});
