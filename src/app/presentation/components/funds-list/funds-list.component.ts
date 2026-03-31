import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';

import { SubscribeToFundUseCase } from '../../../application/use-cases/subscribe-to-fund.use-case';
import { Fund } from '../../../domain/entities/fund.entity';
import { NotificationMethod } from '../../../domain/entities/transaction.entity';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../../application/ports/user-account.port';
import {
  TRANSACTION_RECORD_PORT,
  TransactionRecordPort,
} from '../../../application/ports/transaction-record.port';
import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-funds-list',
  imports: [TableModule, CurrencyPipe],
  templateUrl: './funds-list.component.html',
})
export class FundsListComponent implements OnChanges, OnInit {
  private _funds: Fund[] = [];
  readonly notificationMethods: Array<{ value: NotificationMethod; label: string }> = [
    { value: 'email', label: '📧 Email' },
    { value: 'sms', label: '📱 SMS' },
  ];
  readonly selectedNotificationMethodByFundId: Record<string, NotificationMethod> = {};
  readonly selectedAmountByFundId: Record<string, number> = {};
  readonly hasActiveSubscriptionByFundId: Record<string, boolean> = {};
  feedbackMessage = '';
  hasError = false;
  private readonly subscribeToFundUseCase: SubscribeToFundUseCase = inject(SubscribeToFundUseCase);
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);
  private readonly transactionRecordPort: TransactionRecordPort = inject(TRANSACTION_RECORD_PORT);
  private readonly userBalanceService: UserBalanceService = inject(UserBalanceService);

  @Input() portfolioVersion = 0;

  @Input({ required: true })
  set funds(value: Fund[]) {
    this._funds = value;
    for (const fund of value) {
      this.selectedNotificationMethodByFundId[fund.id] ??= 'email';
      this.selectedAmountByFundId[fund.id] ??= fund.minimumAmount;
    }
    this.refreshActiveSubscriptions();
  }

  get funds(): Fund[] {
    return this._funds;
  }

  get currentBalance(): number {
    return this.userBalanceService.availableBalance();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['portfolioVersion'] && !changes['portfolioVersion'].firstChange) {
      this.userBalanceService.refresh();
      this.refreshActiveSubscriptions();
    }
  }

  ngOnInit(): void {
    this.userBalanceService.refresh();
    this.refreshActiveSubscriptions();
  }

  canSubscribe(fund: Fund): boolean {
    const amount = this.selectedAmountByFundId[fund.id];
    return (
      !this.hasActiveSubscription(fund.id) &&
      Number.isFinite(amount) &&
      amount >= fund.minimumAmount &&
      this.currentBalance >= amount
    );
  }

  onNotificationMethodChange(fundId: string, method: string): void {
    if (method === 'email' || method === 'sms') {
      this.selectedNotificationMethodByFundId[fundId] = method;
    }
  }

  onAmountChange(fund: Fund, value: string): void {
    const parsedValue = Number(value);
    this.selectedAmountByFundId[fund.id] = Number.isFinite(parsedValue)
      ? parsedValue
      : fund.minimumAmount;
  }

  hasActiveSubscription(fundId: string): boolean {
    return this.hasActiveSubscriptionByFundId[fundId] ?? false;
  }

  subscribeToFund(fund: Fund): void {
    this.feedbackMessage = '';
    this.hasError = false;

    try {
      const notificationMethod = this.selectedNotificationMethodByFundId[fund.id] ?? 'email';
      const amount = this.selectedAmountByFundId[fund.id] ?? fund.minimumAmount;
      this.subscribeToFundUseCase.execute({
        fundId: fund.id,
        amount,
        notificationMethod,
      });
      this.userBalanceService.refresh();
      this.refreshActiveSubscriptions();
      this.feedbackMessage = `You subscribed to ${fund.name} via ${notificationMethod.toUpperCase()}.`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not complete subscription.';
      this.feedbackMessage = message;
      this.hasError = true;
    }
  }

  private refreshActiveSubscriptions(): void {
    const user = this.userAccountPort.getCurrentUser();
    const transactions = this.transactionRecordPort.listByUserId(user.id);

    for (const fund of this._funds) {
      const activeSubscriptions = transactions
        .filter((transaction) => transaction.fundId === fund.id)
        .reduce((count, transaction) => {
          if (transaction.type === 'subscription') {
            return count + 1;
          }
          if (transaction.type === 'cancellation') {
            return count - 1;
          }
          return count;
        }, 0);

      this.hasActiveSubscriptionByFundId[fund.id] = activeSubscriptions > 0;
    }
  }
}
