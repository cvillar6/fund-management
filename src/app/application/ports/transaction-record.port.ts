import { InjectionToken } from '@angular/core';

import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionRecordPort {
  create(transaction: Transaction): Transaction;
  listByUserId(userId: string): Transaction[];
}

export const TRANSACTION_RECORD_PORT = new InjectionToken<TransactionRecordPort>(
  'TRANSACTION_RECORD_PORT'
);
