import {
  Box,
  Skeleton,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useUserWallet } from "../../providers/UserWalletProvider/UserWalletProvider";
import { useTranslation, Trans } from "react-i18next";

export const TermsAndConditions = () => {
  const { t } = useTranslation();
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
          label={
            <Typography variant="body2">
              <Trans
                i18nKey="termsAndConditionsHtml"
                components={[
                  <Link
                    href="https://ramp.bando.cool/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  />,
                ]}
              />
            </Typography>
          }
        />
      ) : null}
    </Box>
  );
};
