export type TransactionType = 'subscription' | 'cancellation';

export type NotificationMethod = 'email' | 'sms';

export interface Transaction {
  id: string;
  userId: string;
  fundId: string;
  type: TransactionType;
  amount: number;
  createdAt: Date;
  notificationMethod?: NotificationMethod;
}
