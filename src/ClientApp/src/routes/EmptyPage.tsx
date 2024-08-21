import { Image, Flex, Box } from "@chakra-ui/react";
import imgUrl from "@/assets/images/is_empty.jpg";

export default function EmptyPage(): React.ReactElement {
	return (
		<Flex
			marginTop={10}
			w="100%"
			flexFlow="row wrap"
			justify="center"
			align="center"
			gap={10}
		>
			<Box
				w="100%"
				textAlign={"center"}
				lineHeight="1.2"
				fontSize="1.4rem"
				fontWeight="500"
				color="brandPrimary.100"
			>
				Empty...
			</Box>
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
