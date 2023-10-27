import {
	Button,
	Checkbox,
	Flex,
	Text,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Image,
} from "@chakra-ui/react";
import imgUrl from "@/assets/images/login-image.jpg";

export default function LoginPage(): React.ReactElement {
	return (
		<Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
			<Flex p={8} flex={1} alignItems="center" justifyContent="center">
				<Stack spacing={4} w="full" maxW="md">
					<Heading fontSize={"2xl"}>Sign in to your account</Heading>
					<FormControl id="email">
						<FormLabel>Email address</FormLabel>
						<Input type="email" />
					</FormControl>
					<FormControl id="password">
						<FormLabel>Password</FormLabel>
						<Input type="password" />
					</FormControl>
					<Stack spacing={6}>
						<Stack
							direction={{ base: "column", sm: "row" }}
							alignItems="start"
							justifyContent="space-between"
						>
							<Checkbox>Remember me</Checkbox>
							<Text color={"blue.500"}>Forgot password?</Text>
						</Stack>
						<Button colorScheme="blue" variant="solid">
							Sign in
						</Button>
					</Stack>
				</Stack>
			</Flex>
			<Flex flex={1}>
				<Image alt="Login Image" objectFit="cover" src={imgUrl} />
			</Flex>
		</Stack>
	);
}
