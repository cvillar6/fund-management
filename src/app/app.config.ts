import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { FUND_QUERY_PORT } from './application/ports/fund-query.port';
import { TRANSACTION_RECORD_PORT } from './application/ports/transaction-record.port';
import { USER_ACCOUNT_PORT } from './application/ports/user-account.port';
import { FundQueryInMemoryAdapter } from './infrastructure/adapters/fund-query.in-memory.adapter';
import { TransactionRecordInMemoryAdapter } from './infrastructure/adapters/transaction-record.in-memory.adapter';
import { UserAccountInMemoryAdapter } from './infrastructure/adapters/user-account.in-memory.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: FUND_QUERY_PORT, useClass: FundQueryInMemoryAdapter },
    { provide: USER_ACCOUNT_PORT, useClass: UserAccountInMemoryAdapter },
    { provide: TRANSACTION_RECORD_PORT, useClass: TransactionRecordInMemoryAdapter },
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};
