import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent } from "react";
import { StyledTextField } from "./SearchInput.style";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      onChange={handleSearch}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon style={{ color: "#6e7c7c" }} />
          </InputAdornment>
        ),
      }}
      sx={{ marginBottom: 2 }}
    />
  );
};
