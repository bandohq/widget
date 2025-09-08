import { Search } from "@mui/icons-material";
import { FormControl, InputAdornment } from "@mui/material";
import type { FocusEventHandler, FormEventHandler } from "react";
import { InputCard } from "../../components/Card/InputCard";
import { useHeaderHeight } from "../../stores/header/useHeaderStore";
import { Input, StickySearchInputContainer } from "./SearchInput.style";
import { useTheme } from "@mui/material";

interface SearchInputProps {
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: FormEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
}

export const SearchInput = ({
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  autoFocus,
}: SearchInputProps) => {
  const theme = useTheme();
  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          size="small"
          placeholder={placeholder}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
          sx={{
            backgroundColor: theme.palette.grey[300],
          }}
          inputProps={{
            inputMode: "search",
            onChange,
            onBlur,
            name,
            value,
            maxLength: 128,
          }}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      </FormControl>
    </InputCard>
  );
};

export const StickySearchInput = (props: SearchInputProps) => {
  const { headerHeight } = useHeaderHeight();

  return (
    <StickySearchInputContainer headerHeight={headerHeight}>
      <SearchInput {...props} autoFocus />
    </StickySearchInputContainer>
  );
};
