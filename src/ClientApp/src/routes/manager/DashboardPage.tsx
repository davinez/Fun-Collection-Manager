import { Image, Flex, Box } from "@chakra-ui/react";
import imgUrl from "@/assets/images/hobbit.png";

export const DashboardPage = (): React.ReactElement => {
	return (
		<Flex
			marginTop={10}
			w="100%"
			flexFlow="row wrap"
			justify="center"
			align="center"
			gap={10}
		>
			<Image
				maxW={{ base: "80%", md: "80%", lg: "50%" }}
				maxH="auto"
				objectFit="contain"
				src={imgUrl}
				alt="Dan"
			/>
		</Flex>
	);
}
