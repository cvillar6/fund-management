import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { CancelFundSubscriptionUseCase } from '../../../application/use-cases/cancel-fund-subscription.use-case';
import { PortfolioEventsService } from '../../services/portfolio-events.service';
import { UserBalanceService } from '../../services/user-balance.service';
import { TransactionRow, TransactionsTableComponent } from './transactions-table.component';

describe('TransactionsTableComponent', () => {
  const transactions: TransactionRow[] = [
    {
      id: 'tx-1',
      fundId: '1',
      fundName: 'FPV_BTG_PACTUAL_RECAUDADORA',
      type: 'subscription',
      amount: 100000,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      notificationMethod: 'email',
      canCancel: true,
    },
  ];

  const cancelFundSubscriptionUseCaseMock = {
    execute: () => ({
      id: 'tx-2',
      userId: '1234567890',
      fundId: '1',
      type: 'cancellation',
      amount: 100000,
      createdAt: new Date(),
    }),
  };

  const userBalanceServiceMock = {
    availableBalance: signal(500000),
    refresh: () => {},
  };

  const portfolioEventsServiceMock = {
    version: signal(0),
    notifyChanged: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsTableComponent],
      providers: [
        { provide: CancelFundSubscriptionUseCase, useValue: cancelFundSubscriptionUseCaseMock },
        { provide: UserBalanceService, useValue: userBalanceServiceMock },
        { provide: PortfolioEventsService, useValue: portfolioEventsServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TransactionsTableComponent);
    fixture.componentRef.setInput('transactions', transactions);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should cancel subscription and set success message', () => {
    const executeSpy = vi.spyOn(cancelFundSubscriptionUseCaseMock, 'execute');
    const refreshSpy = vi.spyOn(userBalanceServiceMock, 'refresh');
    const notifySpy = vi.spyOn(portfolioEventsServiceMock, 'notifyChanged');

    const fixture = TestBed.createComponent(TransactionsTableComponent);
    fixture.componentRef.setInput('transactions', transactions);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.cancelSubscription(transactions[0]);

    expect(executeSpy).toHaveBeenCalledWith({ fundId: '1' });
    expect(refreshSpy).toHaveBeenCalled();
    expect(notifySpy).toHaveBeenCalled();
    expect(component.hasError).toBe(false);
    expect(component.feedbackMessage).toContain('Subscription to FPV_BTG_PACTUAL_RECAUDADORA was cancelled.');
  });

  it('should set error state when cancellation fails', () => {
    vi.spyOn(cancelFundSubscriptionUseCaseMock, 'execute').mockImplementation(() => {
      throw new Error('Cannot cancel');
    });

    const fixture = TestBed.createComponent(TransactionsTableComponent);
    fixture.componentRef.setInput('transactions', transactions);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.cancelSubscription(transactions[0]);

    expect(component.hasError).toBe(true);
    expect(component.feedbackMessage).toContain('Cannot cancel');
  });
});
