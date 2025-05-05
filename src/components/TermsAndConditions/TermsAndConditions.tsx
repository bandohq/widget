import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Collapse,
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
    return null;
  }

  const showTerms = !!error || !walletInfo?.wallet?.hasAcceptedTerms;

  return (
    <Box sx={showTerms ? {} : { display: "none" }}>
      <Collapse in={showTerms}>
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
                key="terms-link"
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
      </Collapse>
    </Box>
  );
};
