import { Inject, Injectable } from '@angular/core';

import {
  NotificationMethod,
  Transaction,
} from '../../domain/entities/transaction.entity';
import { FUND_QUERY_PORT, FundQueryPort } from '../ports/fund-query.port';
import { TRANSACTION_RECORD_PORT, TransactionRecordPort } from '../ports/transaction-record.port';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../ports/user-account.port';

export interface SubscribeToFundCommand {
  fundId: string;
  notificationMethod: NotificationMethod;
}

@Injectable({ providedIn: 'root' })
export class SubscribeToFundUseCase {
  constructor(
    @Inject(FUND_QUERY_PORT) private readonly fundQueryPort: FundQueryPort,
    @Inject(USER_ACCOUNT_PORT) private readonly userAccountPort: UserAccountPort,
    @Inject(TRANSACTION_RECORD_PORT)
    private readonly transactionRecordPort: TransactionRecordPort
  ) {}

  execute(command: SubscribeToFundCommand): Transaction {
    const fund = this.fundQueryPort
      .getAvailableFunds()
      .find((availableFund) => availableFund.id === command.fundId);

    if (!fund) {
      throw new Error('Selected fund does not exist.');
    }

    const user = this.userAccountPort.getCurrentUser();

    if (user.balance < fund.minimumAmount) {
      throw new Error(
        `You do not have enough balance to subscribe to ${fund.name}. Minimum required: ${fund.minimumAmount}.`
      );
    }

    this.userAccountPort.updateBalance(user.balance - fund.minimumAmount);

    const transaction: Transaction = {
      id: createTransactionId(),
      userId: user.id,
      fundId: fund.id,
      type: 'subscription',
      amount: fund.minimumAmount,
      createdAt: new Date(),
      notificationMethod: command.notificationMethod,
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
