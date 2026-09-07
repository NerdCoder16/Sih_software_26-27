export enum NotificationChannel {
  IN_APP = 'IN_APP',
  SMS = 'SMS',
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
  SIREN = 'SIREN'
}

export enum NotificationStatus {
  SENT = 'SENT',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  NOT_CONFIGURED = 'NOT_CONFIGURED'
}

export interface Notification {
  id: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  message: string;
  timestamp: string;
}
