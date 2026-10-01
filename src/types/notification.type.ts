import { NotificationStatus, NotificationType } from '@prisma/types';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  metadata: BasicNotificationMetadata | TeamInviteNotificationMetadata;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  userId: string;
};

export type TeamInviteNotificationMetadata = {
  teamId: string;
  teamName: string;
  invitedById: string;
  invitationId: string;
  isResponded: boolean;
  isAccepted?: boolean;
};

export type BasicNotificationMetadata = null;
