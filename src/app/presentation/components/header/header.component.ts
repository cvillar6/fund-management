import { CurrencyPipe } from '@angular/common';
import { Component, Inject, Signal } from '@angular/core';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../../application/ports/user-account.port';
import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-header',
  imports: [CurrencyPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly userName: string;
  readonly availableBalance: Signal<number>;

  constructor(
    @Inject(USER_ACCOUNT_PORT) private readonly userAccountPort: UserAccountPort,
    private readonly userBalanceService: UserBalanceService
  ) {
    const user = this.userAccountPort.getCurrentUser();
    this.userName = user.name;
    this.availableBalance = this.userBalanceService.availableBalance;
  }
}
