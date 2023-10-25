import { Image, Box } from "@chakra-ui/react";
import imgUrl from '@/assets/images/naboo.jpg'

export default function HomePage(): React.ReactElement {
	return (
		<Box>
			<Image src={imgUrl} alt="Dan" />
		</Box>
	);
}
