// Design
import { Input, InputProps } from "@chakra-ui/react";
// Components

// Assets

// Types

// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { useDebouncedCallback } from "use-debounce";
import {
	Location,
	useLocation,
} from "react-router-dom";

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
				//managerSlice.setGetBookmarkParamsSearchValue(event.target.value.trim());
			}
		},
		// delay in ms
		1500,
		// Config debounce
		{
			leading: false,
		}
	);
	const location: Location = useLocation();

	useEffect(() => {
		if (searchValue) {
			managerSlice.setGetBookmarkParamsSearchValue(searchValue);
		} else {
			managerSlice.setGetBookmarkParamsSearchValue("");
		}
	}, [searchValue]);

// Re-render on url change
	return <Input key={location.pathname} defaultValue="" onChange={debounced} {...rest} />;
};
