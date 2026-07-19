import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';

export interface UserAvatarProps extends Omit<AvatarProps, 'children'> {
  /** Full name, used for initials and the tooltip. */
  name: string;
  /** Optional image URL; falls back to colored initials. */
  src?: string;
  /** Shows a green online badge when true, grey when false, none when omitted. */
  online?: boolean;
  /** Wraps the avatar in a tooltip showing the name. */
  tooltip?: boolean;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Deterministic HSL color derived from the name so avatars stay stable. */
function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

/**
 * Avatar built on MUI v7 that falls back to colored initials and can show
 * an online/offline presence badge.
 */
export function UserAvatar({
  name,
  src,
  online,
  tooltip = false,
  sx,
  ...rest
}: UserAvatarProps) {
  const avatar = (
    <Avatar
      {...rest}
      src={src}
      alt={name}
      sx={{ bgcolor: src ? undefined : colorFromName(name), ...sx }}
    >
      {initials(name)}
    </Avatar>
  );

  const withBadge =
    online === undefined ? (
      avatar
    ) : (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: online ? 'success.main' : 'grey.400',
            boxShadow: '0 0 0 2px #fff',
          },
        }}
      >
        {avatar}
      </Badge>
    );

  return tooltip ? <Tooltip title={name}>{withBadge}</Tooltip> : withBadge;
}

export default UserAvatar;
