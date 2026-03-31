import { Inject, Injectable } from '@angular/core';

import { Fund } from '../../domain/entities/fund.entity';
import { FUND_QUERY_PORT, FundQueryPort } from '../ports/fund-query.port';

@Injectable({ providedIn: 'root' })
export class ListAvailableFundsUseCase {
  constructor(@Inject(FUND_QUERY_PORT) private readonly fundQueryPort: FundQueryPort) {}

  execute(): Fund[] {
    return this.fundQueryPort.getAvailableFunds();
  }
}
