import { Component } from '@angular/core';

import { Fund } from '../../../domain/entities/fund.entity';
import { ListAvailableFundsUseCase } from '../../../application/use-cases/list-available-funds.use-case';
import { FundsListComponent } from '../../components/funds-list/funds-list.component';

@Component({
  selector: 'app-home-page',
  imports: [FundsListComponent],
  templateUrl: './home.page.html',
})
export class HomePageComponent {
  readonly funds: Fund[];

  constructor(private readonly listAvailableFundsUseCase: ListAvailableFundsUseCase) {
    this.funds = this.listAvailableFundsUseCase.execute();
  }
}
