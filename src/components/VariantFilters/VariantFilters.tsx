import React from "react";
import {
  Box,
  Chip,
  TextField,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Variant } from "../../stores/ProductProvider/types";

interface VariantFiltersProps {
  uniqueSubTypes: string[];
  selectedSubType: string;
  inputValue: string;
  onSubTypeClick: (subType: string) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VariantFilters: React.FC<VariantFiltersProps> = ({
  uniqueSubTypes,
  selectedSubType,
  inputValue,
  onSubTypeClick,
  onInputChange,
}) => {
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="body2"
        sx={{ mt: 2, color: theme.palette.text.secondary }}
      >
        Type of product
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {uniqueSubTypes.map((subType) => (
          <Chip
            key={subType}
            label={subType}
            onClick={() => onSubTypeClick(subType)}
            color={selectedSubType === subType ? "primary" : "default"}
          />
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: theme.palette.text.secondary }}
      >
        Search by amount
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField
          placeholder="Amount"
          type="number"
          value={inputValue}
          onChange={onInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MagnifyingGlass />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>
    </>
  );
};
