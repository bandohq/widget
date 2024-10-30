import { ArrowDownward, ArrowForward } from "@mui/icons-material";
import { useAvailableChains } from "../../hooks/useAvailableChains.js";
import { useFieldActions } from "../../stores/form/useFieldActions";
import { IconCard, ReverseContainer } from "./ReverseTokensButton.style.js";

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setFieldValue, getFieldValues } = useFieldActions();
  const { getChainById } = useAvailableChains();

  const handleClick = () => {
    const [fromChainId, fromToken, toChainId, toToken, toAddress] =
      getFieldValues(
        "fromChain",
        "fromToken",
        "toChain",
        "toToken",
        "toAddress"
      );
    setFieldValue("fromAmount", "", { isTouched: true });
    setFieldValue("fromChain", toChainId, { isTouched: true });
    setFieldValue("fromToken", toToken, { isTouched: true });
    setFieldValue("toChain", fromChainId, { isTouched: true });
    setFieldValue("toToken", fromToken, { isTouched: true });
  };
  return (
    <ReverseContainer>
      <IconCard onClick={handleClick}>
        {vertical ? (
          <ArrowDownward fontSize="inherit" />
        ) : (
          <ArrowForward fontSize="inherit" />
        )}
      </IconCard>
    </ReverseContainer>
  );
};
