// Design
import { Input, InputProps } from "@chakra-ui/react";
// Components

// Assets

// Hooks

// Types

// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { useDebouncedCallback } from "use-debounce";

type TSearchInputFieldProps = {};

export const SearchInputField = ({
	...rest
}: TSearchInputFieldProps & InputProps) => {
	// Hooks
	const { managerSlice } = useStore();
	const [searchValue, setSearchValue] = useState("");
	const debounced = useDebouncedCallback(
		// function
		(event: React.SyntheticEvent<EventTarget>) => {
			if (event.target instanceof HTMLInputElement) {
				// TODO: Pending value sanitization
				// console.log("handleOnChangeSearchInput " + event.target.value);
				setSearchValue(event.target.value.trim());
			}
		},
		// delay in ms
		1500,
		// Config debounce
		{
			leading: false,
		}
	);

	useEffect(() => {
		if (searchValue) {
			managerSlice.setGetBookmarkParamsSearchValue(searchValue);
		} else {
			managerSlice.setGetBookmarkParamsSearchValue("");
		}
	}, [searchValue]);

	return <Input onChange={debounced} {...rest} />;
};
