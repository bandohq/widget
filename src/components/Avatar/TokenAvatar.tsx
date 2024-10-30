import type { SxProps, Theme } from "@mui/material";
import { Badge } from "@mui/material";
import { AvatarBadgedSkeleton } from "./Avatar.js";
import { AvatarDefaultBadge, AvatarMasked } from "./Avatar.style.js";
import { SmallAvatar } from "./SmallAvatar.js";
import { Chain } from "../../hooks/useAvailableChains.js";

export interface BaseToken {
  chainId: any;
  address: string;
}

export interface StaticToken extends BaseToken {
  symbol: string;
  decimals: number;
  name: string;
  coinKey?: any;
  logoURI?: string;
}

// Mocked hooks replacing SDK-based hooks
const useChain = (chainId?: number) => ({
  chain: chainId
    ? {
        logoURI: "",
        name: "MockChain",
        metamask: null,
        key: "mockKey",
        chainType: "EVM",
        coin: "MCK",
        id: chainId,
        mainnet: true, // Added property to match EVMChain type
      }
    : undefined,
});

const useToken = (chainId?: number, address?: string) => ({
  token: address
    ? {
        logoURI: "",
        symbol: "MCK",
        decimals: 18,
        name: "MockToken",
        chainId: chainId ?? 1,
        address: address,
      }
    : undefined,
  isLoading: false,
});

export const TokenAvatar: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  if (!chain || !token?.logoURI) {
    return <TokenAvatarFallback token={token} isLoading={isLoading} sx={sx} />;
  }
  return (
    <TokenAvatarBase
      token={token}
      chain={chain}
      isLoading={isLoading}
      sx={sx}
    />
  );
};

export const TokenAvatarFallback: React.FC<{
  token?: StaticToken;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, isLoading, sx }) => {
  const { chain } = useChain(token?.chainId);
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token?.chainId,
    token?.address
  );
  return (
    <TokenAvatarBase
      token={chainToken ?? token}
      isLoading={isLoading || isLoadingToken}
      sx={sx}
    />
  );
};

export const TokenAvatarBase: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  return isLoading ? (
    <AvatarBadgedSkeleton />
  ) : (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        chain ? (
          <SmallAvatar src={chain.logoURI} alt={chain.name}>
            {chain.name[0]}
          </SmallAvatar>
        ) : (
          <AvatarDefaultBadge />
        )
      }
      sx={sx}
    >
      <AvatarMasked src={token?.logoURI} alt={token?.symbol}>
        {token?.symbol?.[0]}
      </AvatarMasked>
    </Badge>
  );
};
