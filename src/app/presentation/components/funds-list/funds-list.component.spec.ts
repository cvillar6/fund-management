import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { TRANSACTION_RECORD_PORT } from '../../../application/ports/transaction-record.port';
import { USER_ACCOUNT_PORT } from '../../../application/ports/user-account.port';
import { SubscribeToFundUseCase } from '../../../application/use-cases/subscribe-to-fund.use-case';
import { Fund } from '../../../domain/entities/fund.entity';
import { PortfolioEventsService } from '../../services/portfolio-events.service';
import { UserBalanceService } from '../../services/user-balance.service';
import { FundsListComponent } from './funds-list.component';

describe('FundsListComponent', () => {
  const funds: Fund[] = [
    {
      id: '1',
      name: 'FPV_BTG_PACTUAL_RECAUDADORA',
      minimumAmount: 75000,
      category: 'FPV',
    },
  ];

  const subscribeToFundUseCaseMock = {
    execute: () => ({
      id: 'tx-1',
      userId: '1234567890',
      fundId: '1',
      type: 'subscription',
      amount: 75000,
      createdAt: new Date(),
      notificationMethod: 'email',
    }),
  };

  const userAccountPortMock = {
    getCurrentUser: () => ({
      id: '1234567890',
      name: 'Camilo Villa',
      balance: 500000,
    }),
    updateBalance: (newBalance: number) => ({
      id: '1234567890',
      name: 'Camilo Villa',
      balance: newBalance,
    }),
  };

  const transactionRecordPortMock = {
    create: (transaction: unknown) => transaction,
    listByUserId: () => [],
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
      imports: [FundsListComponent],
      providers: [
        { provide: SubscribeToFundUseCase, useValue: subscribeToFundUseCaseMock },
        { provide: USER_ACCOUNT_PORT, useValue: userAccountPortMock },
        { provide: TRANSACTION_RECORD_PORT, useValue: transactionRecordPortMock },
        { provide: UserBalanceService, useValue: userBalanceServiceMock },
        { provide: PortfolioEventsService, useValue: portfolioEventsServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(FundsListComponent);
    fixture.componentRef.setInput('funds', funds);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should subscribe successfully and set success message', () => {
    const executeSpy = vi.spyOn(subscribeToFundUseCaseMock, 'execute');
    const refreshSpy = vi.spyOn(userBalanceServiceMock, 'refresh');
    const notifySpy = vi.spyOn(portfolioEventsServiceMock, 'notifyChanged');

    const fixture = TestBed.createComponent(FundsListComponent);
    fixture.componentRef.setInput('funds', funds);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.subscribeToFund(funds[0]);

    expect(executeSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
    expect(notifySpy).toHaveBeenCalled();
    expect(component.hasError).toBe(false);
    expect(component.feedbackMessage).toContain('You subscribed to FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should set error state when subscription fails', () => {
    vi.spyOn(subscribeToFundUseCaseMock, 'execute').mockImplementation(() => {
      throw new Error('Not enough balance');
    });

    const fixture = TestBed.createComponent(FundsListComponent);
    fixture.componentRef.setInput('funds', funds);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.subscribeToFund(funds[0]);

    expect(component.hasError).toBe(true);
    expect(component.feedbackMessage).toContain('Not enough balance');
  });
});
