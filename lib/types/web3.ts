export type ConnectionStatus = 'unknown' | 'connecting' | 'connected' | 'disconnected';

export interface TransactionEvent {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface PriceFeed {
  symbol: string;
  price: string;
  timestamp: number;
}

export interface UserNotification {
  id: string;
  type: 'transaction' | 'price' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}
