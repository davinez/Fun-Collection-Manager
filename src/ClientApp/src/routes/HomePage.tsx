import { Image, Box } from "@chakra-ui/react";
import imgUrl from "@/assets/images/naboo.jpg";

export default function HomePage(): React.ReactElement {
	return (
		<Box w="full" h="full">
			<Image w="full" h="full" src={imgUrl} alt="Dan" />
		</Box>
	);
}
