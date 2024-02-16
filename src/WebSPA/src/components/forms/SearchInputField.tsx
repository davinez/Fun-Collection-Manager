// Design
import {
	Input,
	InputProps,
} from "@chakra-ui/react";
// Components

// Assets

// Hooks

// Types

// General
import { useState, useEffect } from "react";
import { useStore } from "@/store/UseStore";
import { useDebounce } from 'use-debounce';

type TSearchInputFieldProps = {
};

export const SearchInputField = ({
	...rest
}: TSearchInputFieldProps & InputProps) => {
  // Hooks
  const { managerSlice } = useStore();
	const [searchValue, setSearchValue] = useState("");
	const [searchValueDebounce] = useDebounce(searchValue, 1000, { leading: true });

  useEffect(() => {
    if(searchValueDebounce.trim().length >= 3) {
      
    }
  }, [searchValueDebounce]);

  // Handlers
  const handleOnChangeSearchInput = (
		event: React.SyntheticEvent<EventTarget>
	) => {
		if (event.target instanceof HTMLInputElement) {
			setSearchValue(event.target.value);
		}
	};

  // leading = true, value is updated immediately when text changes the first time,
  // but all subsequent changes are debounced.
  return (
			<Input 
      onChange={handleOnChangeSearchInput}
      {...rest}
      />
	);
};
