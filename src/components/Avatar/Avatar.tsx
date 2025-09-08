import type { SxProps, Theme } from "@mui/material";
import { Avatar, Badge, Skeleton } from "@mui/material";
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarSkeletonMaskedContainer,
} from "./Avatar.style";
import { SmallAvatarSkeleton } from "./SmallAvatar";
import { getInitials } from "../../utils/getInitials";
import { width } from "@mui/system";
import { truncateText } from "../../utils/truncateText";

export const AvatarBadgedDefault: React.FC<{
  sx?: SxProps<Theme>;
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={<AvatarDefaultBadge />}
      sx={sx}
    >
      <AvatarDefault />
    </Badge>
  );
};

export const ImageAvatar: React.FC<{
  src?: string;
  name?: string;
  sx?: SxProps<Theme>;
  hideName?: boolean;
}> = ({ src, sx, name, hideName }) => {
  return src ? (
    <div
      className="brand-button"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={src}
        alt={name}
        //@ts-ignore
        style={{
          ...sx,
          borderRadius: "10%",
          objectFit: "contain",
        }}
      />
      {!hideName && (
        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          {truncateText(name, 9)}
        </div>
      )}
    </div>
  ) : (
    <div
      className="brand-button"
      //@ts-ignore
      style={{
        ...sx,
        width: "100%",
        marginRight: !hideName ? 0 : "10px",
      }}
    >
      <Avatar sx={{ width: "100%", height: "100%" }} variant="rounded">
        {getInitials(name)}
      </Avatar>
      {!hideName && (
        <div style={{ fontSize: "12px", textAlign: "center" }}>
          {truncateText(name, 9)}
        </div>
      )}
    </div>
  );
};

export const AvatarBadgedSkeleton: React.FC<{
  sx?: SxProps<Theme>;
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={<SmallAvatarSkeleton />}
      sx={sx}
    >
      <AvatarSkeleton />
    </Badge>
  );
};

export const AvatarSkeleton = () => {
  return (
    <AvatarSkeletonMaskedContainer>
      <Skeleton width={40} height={40} variant="circular" />
    </AvatarSkeletonMaskedContainer>
  );
};
