import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CancelFundSubscriptionUseCase } from '../../../application/use-cases/cancel-fund-subscription.use-case';
import { UserBalanceService } from '../../services/user-balance.service';

export interface TransactionRow {
  id: string;
  fundId: string;
  fundName: string;
  type: string;
  amount: number;
  createdAt: Date;
  notificationMethod: string;
  canCancel: boolean;
}

@Component({
  selector: 'app-transactions-table',
  imports: [TableModule, DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './transactions-table.component.html',
})
export class TransactionsTableComponent {
  readonly transactions = input.required<TransactionRow[]>();
  readonly portfolioChanged = output<void>();

  feedbackMessage = '';
  hasError = false;

  private readonly cancelFundSubscriptionUseCase: CancelFundSubscriptionUseCase = inject(CancelFundSubscriptionUseCase);
  private readonly userBalanceService: UserBalanceService = inject(UserBalanceService);

  cancelSubscription(row: TransactionRow): void {
    if (!row.canCancel) {
      return;
    }

    this.feedbackMessage = '';
    this.hasError = false;

    try {
      this.cancelFundSubscriptionUseCase.execute({ fundId: row.fundId });
      this.userBalanceService.refresh();
      this.portfolioChanged.emit();
      this.feedbackMessage = `Subscription to ${row.fundName} was cancelled.`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not cancel subscription.';
      this.feedbackMessage = message;
      this.hasError = true;
    }
  }
}
