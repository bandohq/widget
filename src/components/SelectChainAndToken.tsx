import type { BoxProps, Theme } from "@mui/material";
import { Box, useMediaQuery } from "@mui/material";
import { ReverseTokensButton } from "../components/ReverseTokensButton/ReverseTokensButton";
import { SelectTokenButton } from "../components/SelectTokenButton/SelectTokenButton";
import { useWidgetConfig } from "../providers/WidgetProvider/WidgetProvider.js";
import { useFieldValues } from "../stores/form/useFieldValues.js";
import { DisabledUI, HiddenUI } from "../types/widget.js";
import { ReverseTokensButtonEmpty } from "./ReverseTokensButton/ReverseTokensButton.style";

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const { disabledUI, hiddenUI, subvariant } = useWidgetConfig();

  const [fromChain, toChain, fromToken] = useFieldValues(
    "fromChain",
    "toChain",
    "fromToken"
  );

  const hiddenReverse =
    subvariant === "refuel" ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ToToken);

  const hiddenToToken =
    subvariant === "custom" || hiddenUI?.includes(HiddenUI.ToToken);

  const isCompact =
    !!fromChain &&
    !!toChain &&
    !!fromToken &&
    !prefersNarrowView &&
    !hiddenToToken;

  return (
    <Box
      sx={{ display: "flex", flexDirection: isCompact ? "row" : "column" }}
      {...props}
    >
      <SelectTokenButton formType="from" compact={isCompact} />
      {!hiddenToToken ? (
        !hiddenReverse ? (
          <ReverseTokensButton vertical={!isCompact} />
        ) : (
          <ReverseTokensButtonEmpty />
        )
      ) : null}
      {!hiddenToToken ? (
        <SelectTokenButton formType="to" compact={isCompact} />
      ) : null}
    </Box>
  );
};
