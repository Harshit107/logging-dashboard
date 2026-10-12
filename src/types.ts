export type UserDataType = 'notification' | 'otp' | 'link' | 'custom';
export type UserDataStatus = 'queued' | 'dispatched' | 'failed' | 'acknowledged';

export interface UserDataLogRecord {
  _id: string;
  messageId: string;
  sender?: string;
  recipient?: string;
  replyTo?: string;
  app: string;
  subject?: string;
  type: UserDataType;
  status: UserDataStatus;
  metadata?: Record<string, any>;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UserDataLogResponse {
  success: boolean;
  data: {
    messageId: string;
    records: UserDataLogRecord[];
    count: number;
    pagination: PaginationInfo;
  };
  message: string;
  error: {
    errorCode: string;
    message: string;
  } | null;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'offline';
  uptime?: number;
  timestamp?: string;
}
