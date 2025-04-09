import {
  Box,
  Skeleton,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useUserWallet } from "../../providers/UserWalletProvider/UserWalletProvider";

export const TermsAndConditions = () => {
  const {
    walletInfo,
    isPending,
    error,
    userAcceptedTermsAndConditions,
    setUserAcceptedTermsAndConditions,
  } = useUserWallet();

  if (isPending) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ mb: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {error || !walletInfo?.wallet?.hasAcceptedTerms ? (
        <FormControlLabel
          control={
            <Checkbox
              checked={userAcceptedTermsAndConditions}
              onChange={(e) =>
                setUserAcceptedTermsAndConditions(e.target.checked)
              }
            />
          }
          label="Acepto los términos y condiciones"
        />
      ) : null}
    </Box>
  );
};
