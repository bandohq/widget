import type { BoxProps, Theme } from "@mui/material";
import { Box, useMediaQuery } from "@mui/material";
import { useFieldValues } from "../stores/form/useFieldValues.js";
import { SelectTokenButtonForProducts } from "./SelectTokenButton/SelectTokenButtonForProducts";

interface Props extends BoxProps {
  readOnly?: boolean;
}

export const SelectChainAndToken: React.FC<Props> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [fromChain, toChain, fromToken] = useFieldValues(
    "fromChain",
    "productId",
    "fromToken"
  );

  const isCompact =
    !!fromChain && !!toChain && !!fromToken && !prefersNarrowView;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isCompact ? "row" : "column",
        marginY: 2,
      }}
      {...props}
    >
      <SelectTokenButtonForProducts
        formType="from"
        compact={isCompact}
        readOnly={props.readOnly}
      />
    </Box>
  );
};
