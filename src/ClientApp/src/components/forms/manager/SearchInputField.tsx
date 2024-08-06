// Design
import { Input, InputProps } from "@chakra-ui/react";
// Components

// Assets

// Types

// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { useDebouncedCallback } from "use-debounce";
import { Location, useLocation } from "react-router-dom";
import { SEARCHBAR_MAX_LENGHT } from "@/shared/config";
import { FilterBookmarksEnum } from "@/shared/types/global.types";

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
		2000,
		// Config debounce
		{
			leading: false,
		}
	);
	const location: Location = useLocation();

	const onlyAllowedChars = (searchValue: string) => {
		const allowChars = [
			">",
			"<",
			"-",
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
		];

		for (let index = 0; index < searchValue.length; index++) {
			if (!allowChars.includes(searchValue[index] as string)) {
				return false;
			}
		}

		return true;
	};

	useEffect(() => {
		if (searchValue) {
			let isValidSearchValue = false;

			if (
				managerSlice.getBookmarkParams.filterType ===
					FilterBookmarksEnum.CreationDate &&
				searchValue.length <= 11
			) {
				// Lenght 4 => YYYY
				// Lenght 7 => YYYY-MM
				// Lenght 10 => YYYY-MM-DD
				// Lenght 11 => >YYYY-MM-DD or <YYYY-MM-DD

				if (!onlyAllowedChars(searchValue)) {
					//managerSlice.setGetBookmarkParamsSearchValue("");
					return;
				}

				if (searchValue.length === 4 && !Number.isNaN(Number(searchValue))) {
					isValidSearchValue = true;
				} else if (
					searchValue.length === 7 &&
					!Number.isNaN(Number(searchValue.substring(0, 3))) &&
					!Number.isNaN(Number(searchValue.substring(5, 6)))
				) {
					isValidSearchValue = true;
				} else if (
					searchValue.length === 10 &&
					!Number.isNaN(Number(searchValue.substring(0, 3))) &&
					!Number.isNaN(Number(searchValue.substring(5, 6))) &&
					!Number.isNaN(Number(searchValue.substring(8, 9)))
				) {
					isValidSearchValue = true;
				} else if (
					searchValue.length === 10 &&
					!Number.isNaN(Number(searchValue.substring(0, 3))) &&
					!Number.isNaN(Number(searchValue.substring(5, 6))) &&
					!Number.isNaN(Number(searchValue.substring(8, 9))) &&
					[">", "<"].includes(searchValue[10] as string)
				) {
					isValidSearchValue = true;
				}

				if (isValidSearchValue) {
					managerSlice.setGetBookmarkParamsSearchValue(searchValue);
				}
				return;
			}

			// FilterBookmarksEnum.Info and FilterBookmarksEnum.URL
			let searchValueFormatted =
				searchValue.length <= SEARCHBAR_MAX_LENGHT
					? searchValue
					: searchValue.substring(0, SEARCHBAR_MAX_LENGHT);

			managerSlice.setGetBookmarkParamsSearchValue(searchValueFormatted);
		} else {
			managerSlice.setGetBookmarkParamsSearchValue("");
		}
	}, [searchValue]);

	// Re-render on url change
	return (
		<Input
			key={location.pathname}
			defaultValue=""
			onChange={debounced}
			isInvalid={searchValue.length > SEARCHBAR_MAX_LENGHT}
			{...rest}
		/>
	);
};
