import type { SxProps, Theme } from "@mui/material";
import { Badge } from "@mui/material";
import { AvatarBadgedSkeleton } from "./Avatar.js";
import { AvatarDefaultBadge, AvatarMasked } from "./Avatar.style.js";
import { SmallAvatar } from "./SmallAvatar.js";
import { Chain } from "../../pages/SelectChainPage/types.js";
import { useToken } from "../../hooks/useToken.js";

export interface BaseToken {
  chainId: any;
  address: string;
}

export interface StaticToken extends BaseToken {
  symbol: string;
  decimals: number;
  name: string;
  coinKey?: any;
  image_url?: string;
}

export const TokenAvatar: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  if (!chain || !token?.image_url) {
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
          <SmallAvatar src={chain.logo_url} alt={chain.name}>
            {chain.name[0]}
          </SmallAvatar>
        ) : (
          <AvatarDefaultBadge />
        )
      }
      sx={sx}
    >
      <AvatarMasked src={token?.image_url} alt={token?.symbol}>
        {token?.symbol?.[0]}
      </AvatarMasked>
    </Badge>
  );
};
