import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	type AlertProps,
} from "@chakra-ui/react";

type TGeneralAlertProps = {
	title?: string;
	description: string;
	status: string;
};

export const GeneralAlert = ({
	title,
	description,
	...rest
}: TGeneralAlertProps & AlertProps): JSX.Element => {
	return (
		<Alert {...rest}>
			<AlertIcon />
			{typeof title === "string" && <AlertTitle>{title}</AlertTitle>}
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
