import { inject, Injectable } from '@angular/core';

import { Transaction } from '../../domain/entities/transaction.entity';
import { FUND_QUERY_PORT, FundQueryPort } from '../ports/fund-query.port';
import { TRANSACTION_RECORD_PORT, TransactionRecordPort } from '../ports/transaction-record.port';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../ports/user-account.port';

export interface CancelFundSubscriptionCommand {
  fundId: string;
}

@Injectable({ providedIn: 'root' })
export class CancelFundSubscriptionUseCase {
  private readonly fundQueryPort: FundQueryPort = inject(FUND_QUERY_PORT);
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);
  private readonly transactionRecordPort: TransactionRecordPort = inject(TRANSACTION_RECORD_PORT);

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

    const { activeDepth, refundableAmount } = computeActiveSubscriptionState(userFundTransactions);

    if (activeDepth <= 0 || refundableAmount <= 0) {
      throw new Error(`You are not subscribed to ${fund.name}, so it cannot be cancelled.`);
    }

    this.userAccountPort.updateBalance(user.balance + refundableAmount);

    const transaction: Transaction = {
      id: createTransactionId(),
      userId: user.id,
      fundId: fund.id,
      type: 'cancellation',
      amount: refundableAmount,
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

function computeActiveSubscriptionState(transactions: Transaction[]): {
  activeDepth: number;
  refundableAmount: number;
} {
  const sorted = [...transactions].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  let depth = 0;
  let refundableAmount = 0;

  for (const transaction of sorted) {
    if (transaction.type === 'subscription') {
      depth++;
      if (depth === 1) {
        refundableAmount = transaction.amount;
      }
    } else if (transaction.type === 'cancellation') {
      depth--;
      if (depth === 0) {
        refundableAmount = 0;
      }
    }
  }

  return { activeDepth: depth, refundableAmount };
}
