import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';

import {
  TRANSACTION_RECORD_PORT,
  TransactionRecordPort,
} from '../../../application/ports/transaction-record.port';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../../application/ports/user-account.port';
import { SubscribeToFundUseCase } from '../../../application/use-cases/subscribe-to-fund.use-case';
import { Fund } from '../../../domain/entities/fund.entity';
import { NotificationMethod } from '../../../domain/entities/transaction.entity';
import { PortfolioEventsService } from '../../services/portfolio-events.service';
import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-funds-list',
  imports: [TableModule, CurrencyPipe],
  templateUrl: './funds-list.component.html',
})
export class FundsListComponent implements OnInit {
  private readonly subscribeToFundUseCase: SubscribeToFundUseCase = inject(SubscribeToFundUseCase);
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);
  private readonly transactionRecordPort: TransactionRecordPort = inject(TRANSACTION_RECORD_PORT);
  private readonly portfolioEventsService: PortfolioEventsService = inject(PortfolioEventsService);
  private readonly userBalanceService: UserBalanceService = inject(UserBalanceService);

  readonly funds = input.required<Fund[]>();

  readonly notificationMethods: Array<{ value: NotificationMethod; label: string }> = [
    { value: 'email', label: '📧 Email' },
    { value: 'sms', label: '📱 SMS' },
  ];

  readonly selectedNotificationMethodByFundId: Record<string, NotificationMethod> = {};
  readonly selectedAmountByFundId: Record<string, number> = {};
  readonly hasActiveSubscriptionByFundId: Record<string, boolean> = {};

  feedbackMessage = '';
  hasError = false;

  get currentBalance(): number {
    return this.userBalanceService.availableBalance();
  }

  ngOnInit(): void {
    this.userBalanceService.refresh();
    this.refreshActiveSubscriptions();
  }

  private readonly fundsInputEffect = effect(() => {
    const currentFunds = this.funds();

    for (const fund of currentFunds) {
      this.selectedNotificationMethodByFundId[fund.id] ??= 'email';
      this.selectedAmountByFundId[fund.id] ??= fund.minimumAmount;
    }

    this.refreshActiveSubscriptions();
  });

  private readonly portfolioEventsEffect = effect(() => {
    this.portfolioEventsService.version();
    this.userBalanceService.refresh();
    this.refreshActiveSubscriptions();
  });

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
      this.portfolioEventsService.notifyChanged();
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

    for (const fund of this.funds()) {
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
