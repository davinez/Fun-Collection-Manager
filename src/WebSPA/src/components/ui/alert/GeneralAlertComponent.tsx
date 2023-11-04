import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	type AlertProps,
} from "@chakra-ui/react";

type TAlertComponentProps = {
	title?: string;
	description: string;
	status: string;
};

export const GeneralAlertComponent = ({
	title,
	description,
	...rest
}: TAlertComponentProps & AlertProps): JSX.Element => {
	return (
		<Alert {...rest}>
			<AlertIcon />
			{typeof title === "string" && <AlertTitle>{title}</AlertTitle>}
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
