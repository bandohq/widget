import React from "react";
import { Box, Chip, InputAdornment, Typography, useTheme } from "@mui/material";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { StyledTextField } from "./VariantFilters.styles";

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
        <StyledTextField
          placeholder="Amount"
          type="number"
          value={inputValue}
          onChange={onInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MagnifyingGlass size={18} />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>
    </>
  );
};
