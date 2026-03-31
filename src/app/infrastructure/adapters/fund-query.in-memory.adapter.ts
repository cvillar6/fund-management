import { Injectable } from '@angular/core';
import { FundQueryPort } from '../../application/ports/fund-query.port';
import { Fund } from '../../domain/entities/fund.entity';
import { MOCK_FUNDS } from '../config/funds-mock';

@Injectable()
export class FundQueryInMemoryAdapter implements FundQueryPort {
  getAvailableFunds(): Fund[] {
    return [...MOCK_FUNDS];
  }
}
