import { InjectionToken } from '@angular/core';

import { Fund } from '../../domain/entities/fund.entity';

export interface FundQueryPort {
  getAvailableFunds(): Fund[];
}

export const FUND_QUERY_PORT = new InjectionToken<FundQueryPort>('FUND_QUERY_PORT');
