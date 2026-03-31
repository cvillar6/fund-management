import { Injectable } from '@angular/core';

import { TransactionRecordPort } from '../../application/ports/transaction-record.port';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class TransactionRecordInMemoryAdapter implements TransactionRecordPort {
  private readonly transactions: Transaction[] = [];

  create(transaction: Transaction): Transaction {
    this.transactions.push(transaction);
    return { ...transaction };
  }
}
