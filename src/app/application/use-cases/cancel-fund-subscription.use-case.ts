import { Inject, Injectable } from '@angular/core';

import { Transaction } from '../../domain/entities/transaction.entity';
import { FUND_QUERY_PORT, FundQueryPort } from '../ports/fund-query.port';
import { TRANSACTION_RECORD_PORT, TransactionRecordPort } from '../ports/transaction-record.port';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../ports/user-account.port';

export interface CancelFundSubscriptionCommand {
  fundId: string;
}

@Injectable({ providedIn: 'root' })
export class CancelFundSubscriptionUseCase {
  constructor(
    @Inject(FUND_QUERY_PORT) private readonly fundQueryPort: FundQueryPort,
    @Inject(USER_ACCOUNT_PORT) private readonly userAccountPort: UserAccountPort,
    @Inject(TRANSACTION_RECORD_PORT)
    private readonly transactionRecordPort: TransactionRecordPort
  ) {}

  execute(command: CancelFundSubscriptionCommand): Transaction {
    const fund = this.fundQueryPort
      .getAvailableFunds()
      .find((availableFund) => availableFund.id === command.fundId);

    if (!fund) {
      throw new Error('Selected fund does not exist.');
    }

    const user = this.userAccountPort.getCurrentUser();
    const userFundTransactions = this.transactionRecordPort
      .listByUserId(user.id)
      .filter((transaction) => transaction.fundId === fund.id);

    const activeSubscriptions = userFundTransactions.reduce((count, transaction) => {
      if (transaction.type === 'subscription') {
        return count + 1;
      }

      if (transaction.type === 'cancellation') {
        return count - 1;
      }

      return count;
    }, 0);

    if (activeSubscriptions <= 0) {
      throw new Error(`You are not subscribed to ${fund.name}, so it cannot be cancelled.`);
    }

    this.userAccountPort.updateBalance(user.balance + fund.minimumAmount);

    const transaction: Transaction = {
      id: createTransactionId(),
      userId: user.id,
      fundId: fund.id,
      type: 'cancellation',
      amount: fund.minimumAmount,
      createdAt: new Date(),
    };

    return this.transactionRecordPort.create(transaction);
  }
}

function createTransactionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `tx-${Date.now()}`;
}
