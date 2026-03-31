import { Component } from '@angular/core';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { Transaction } from '../../../domain/entities/transaction.entity';
import { Fund } from '../../../domain/entities/fund.entity';
import { ListAvailableFundsUseCase } from '../../../application/use-cases/list-available-funds.use-case';
import { ListTransactionHistoryUseCase } from '../../../application/use-cases/list-transaction-history.use-case';
import { FundsListComponent } from '../../components/funds-list/funds-list.component';
import {
  TransactionsTableComponent,
  TransactionRow,
} from '../../components/transactions-table/transactions-table.component';
import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-home-page',
  imports: [FundsListComponent, TransactionsTableComponent, Tabs, TabList, Tab, TabPanels, TabPanel],
  templateUrl: './home.page.html',
})
export class HomePageComponent {
  readonly funds: Fund[];
  transactions: TransactionRow[] = [];
  activeTab: string | number = 'funds';
  portfolioVersion = 0;

  constructor(
    private readonly listAvailableFundsUseCase: ListAvailableFundsUseCase,
    private readonly listTransactionHistoryUseCase: ListTransactionHistoryUseCase,
    private readonly userBalanceService: UserBalanceService
  ) {
    this.funds = this.listAvailableFundsUseCase.execute();
    this.refreshTransactions();
  }

  onTabChange(value: string | number | undefined): void {
    if (value === undefined) {
      return;
    }
    this.activeTab = value;
    if (value === 'history') {
      this.refreshTransactions();
    }
  }

  onPortfolioChanged(): void {
    this.userBalanceService.refresh();
    this.refreshTransactions();
    this.portfolioVersion++;
  }

  private refreshTransactions(): void {
    const funds = this.listAvailableFundsUseCase.execute();
    const fundNameById = new Map(funds.map((fund) => [fund.id, fund.name]));

    const raw = this.listTransactionHistoryUseCase.execute();
    const activeSubscriptionIdByFund = buildActiveSubscriptionIdByFund(raw);

    this.transactions = raw.map((transaction) => {
      const activeId = activeSubscriptionIdByFund.get(transaction.fundId) ?? null;
      const canCancel =
        transaction.type === 'subscription' && activeId !== null && transaction.id === activeId;

      return {
        id: transaction.id,
        fundId: transaction.fundId,
        fundName: fundNameById.get(transaction.fundId) ?? transaction.fundId,
        type: transaction.type,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        notificationMethod: transaction.notificationMethod ?? '-',
        canCancel,
      };
    });
  }
}

function buildActiveSubscriptionIdByFund(transactions: Transaction[]): Map<string, string | null> {
  const byFund = new Map<string, Transaction[]>();
  for (const transaction of transactions) {
    const list = byFund.get(transaction.fundId) ?? [];
    list.push(transaction);
    byFund.set(transaction.fundId, list);
  }

  const result = new Map<string, string | null>();
  for (const [fundId, list] of byFund) {
    const sorted = [...list].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    let depth = 0;
    let openSubscriptionId: string | null = null;

    for (const transaction of sorted) {
      if (transaction.type === 'subscription') {
        depth++;
        if (depth === 1) {
          openSubscriptionId = transaction.id;
        }
      } else if (transaction.type === 'cancellation') {
        depth--;
        if (depth === 0) {
          openSubscriptionId = null;
        }
      }
    }

    result.set(fundId, depth === 1 ? openSubscriptionId : null);
  }

  return result;
}
