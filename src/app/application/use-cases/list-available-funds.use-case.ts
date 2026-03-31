import { inject, Injectable } from '@angular/core';

import { Fund } from '../../domain/entities/fund.entity';
import { FUND_QUERY_PORT, FundQueryPort } from '../ports/fund-query.port';

@Injectable({ providedIn: 'root' })
export class ListAvailableFundsUseCase {
  private readonly fundQueryPort: FundQueryPort = inject(FUND_QUERY_PORT);

  execute(): Fund[] {
    return this.fundQueryPort.getAvailableFunds();
  }
}
