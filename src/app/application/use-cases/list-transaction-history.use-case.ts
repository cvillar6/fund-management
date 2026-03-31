import { inject, Injectable } from '@angular/core';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TRANSACTION_RECORD_PORT, TransactionRecordPort } from '../ports/transaction-record.port';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../ports/user-account.port';

@Injectable({ providedIn: 'root' })
export class ListTransactionHistoryUseCase {
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);
  private readonly transactionRecordPort: TransactionRecordPort = inject(TRANSACTION_RECORD_PORT);

  execute(): Transaction[] {
    const user = this.userAccountPort.getCurrentUser();

    return this.transactionRecordPort
      .listByUserId(user.id)
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  }
}
