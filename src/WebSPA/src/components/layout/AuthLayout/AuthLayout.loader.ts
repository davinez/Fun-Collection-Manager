export const getUserDataLoader = async (): Promise<unknown> => {
	// const user = window.localStorage.getItem("user");

	// fire one or multiple api calls with the use of defer in react-router-dom
	const userData = await fetch("http://localhost:3000/tasks").then((response) =>
		response.json()
	);

	return userData;
};
