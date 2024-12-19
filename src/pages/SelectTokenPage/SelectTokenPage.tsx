import { Box } from "@mui/material";
import type { FC } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FullPageContainer } from "../../components/FullPageContainer.js";
import { TokenList } from "../../components/TokenList/TokenList.js";
import { useHeader } from "../../hooks/useHeader.js";
import { useNavigateBack } from "../../hooks/useNavigateBack.js";
import { useScrollableOverflowHidden } from "../../hooks/useScrollableContainer.js";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider.js";
import type { FormTypeProps } from "../../stores/form/types.js";
import { SearchTokenInput } from "./SearchTokenInput.js";
import { useTokenListHeight } from "./useTokenListHeight.js";
import { palette } from "../../themes/palettes.js";

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden();
  const { navigateBack } = useNavigateBack();
  const headerRef = useRef<HTMLElement>(null);
  const listParentRef = useRef<HTMLUListElement | null>(null);
  const { tokenListHeight, minListHeight } = useTokenListHeight({
    listParentRef,
    headerRef,
  });

  const { subvariant } = useWidgetConfig();
  const { t } = useTranslation();
  const title =
    formType === "from"
      ? subvariant === "custom"
        ? t("header.payWith")
        : t("header.from")
      : t("header.to");

  useHeader(title);

  return (
    <FullPageContainer disableGutters>
      <Box pb={2} px={3} ref={headerRef}>
        <Box mt={2}>
          <SearchTokenInput />
        </Box>
      </Box>
      <Box height={minListHeight}>
        <TokenList
          parentRef={listParentRef}
          height={tokenListHeight}
          onClick={navigateBack}
          formType={formType}
        />
      </Box>
      <Box
        ml={"auto"}
        p={2}
        textAlign="center"
        sx={{ bgcolor: palette.primary.medium, width: "90%", fontSize: "11px" }}
      >
        Change the network on your wallet to see the balance on that chain
      </Box>
    </FullPageContainer>
  );
};
