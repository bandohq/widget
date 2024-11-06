import { ArrowForward, ErrorRounded, InfoRounded } from "@mui/icons-material";
import { ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LiFiStep,
  Process,
  useProcessMessage,
} from "../../hooks/useProcessMessage";
import { useRouteExecution } from "../../hooks/useRouteExecution";
import { RouteExecutionStatus } from "../../stores/routes/types";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { TokenAvatarGroup } from "../Avatar/Avatar.style";
import { TokenAvatar } from "../Avatar/TokenAvatar";
// import { StepTimer } from '../Step/StepTimer'
import { ListItem, ListItemButton } from "./ActiveTransactions.style";

export const ActiveTransactionItem: React.FC<{
  routeId: string;
  dense?: boolean;
}> = ({ routeId, dense }) => {
  const navigate = useNavigate();
  const { route, status } = useRouteExecution({
    routeId,
    executeInBackground: true,
  });

  // Mocked action property for lastActiveStep to match LiFiStep type
  const lastActiveStep = route?.steps.findLast((step) => step.execution) ?? {
    action: {
      fromAmount: "1000000000000000000", // Mocked value
      fromToken: {
        symbol: "ETH",
        decimals: 18,
      },
      fromChainId: 1,
    },
    execution: {
      status: "IN_PROGRESS",
      process: [
        {
          status: "ACTION_REQUIRED",
          substatus: "PARTIAL",
          txHash: "0xMockTxHash",
          type: "SWAP",
        },
      ],
    },
  };

  const lastActiveProcess = lastActiveStep.execution?.process.at(-1);

  const { title } = useProcessMessage(
    lastActiveStep as LiFiStep,
    lastActiveProcess as Process
  );

  if (!route || !lastActiveStep) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.transactionExecution, { state: { routeId } });
  };

  const getStatusComponent = () => {
    switch (lastActiveProcess?.status) {
      case "ACTION_REQUIRED":
        return <InfoRounded color="info" fontSize="small" />;
      case "FAILED":
        return <ErrorRounded color="error" fontSize="small" />;
      default:
        return (
          <Typography fontSize={14} fontWeight={600}>
            {/* <StepTimer step={lastActiveStep} hideInProgress /> */}
            timer
          </Typography>
        );
    }
  };

  const ListItemComponent = dense ? ListItem : ListItemButton;

  return (
    <ListItemComponent onClick={handleClick} dense disableRipple={dense}>
      <ListItemAvatar>
        <TokenAvatarGroup total={2}>
          <TokenAvatar
            token={{
              ...route.fromToken,
              name: route.fromToken.symbol, // add the name property
              chainId: 1, // add the chainId property (replace with the actual chainId)
            }}
          />
        </TokenAvatarGroup>
      </ListItemAvatar>
      <ListItemText
        sx={{ margin: 0 }}
        disableTypography
        primary={
          <Typography
            fontWeight={500}
            lineHeight={1}
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: 2,
              height: 16,
            }}
          >
            {route.fromToken.symbol}
            <ArrowForward sx={{ paddingX: 0.5 }} />
            {route.toToken.symbol}
          </Typography>
        }
        secondary={
          status !== RouteExecutionStatus.Done ? (
            <Typography
              fontWeight={400}
              fontSize={12}
              color="text.secondary"
              lineHeight={1}
              mt={0.75}
              ml={2}
            >
              {title}
            </Typography>
          ) : null
        }
      />
      {getStatusComponent()}
    </ListItemComponent>
  );
};
