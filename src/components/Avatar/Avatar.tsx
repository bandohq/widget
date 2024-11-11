import type { SxProps, Theme } from "@mui/material";
import { Avatar, Badge, Skeleton } from "@mui/material";
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarSkeletonMaskedContainer,
} from "./Avatar.style";
import { SmallAvatarSkeleton } from "./SmallAvatar";
import { getInitials } from "../../utils/getInitials";

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
}> = ({ src, sx, name }) => {
  return src ? (
    <img
      src={src}
      alt={name}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <Avatar sx={sx} variant="rounded">
      {getInitials(name)}
    </Avatar>
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
