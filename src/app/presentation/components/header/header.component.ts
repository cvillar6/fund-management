import { CurrencyPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
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
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);
  private readonly userBalanceService: UserBalanceService = inject(UserBalanceService);

  constructor() {
    const user = this.userAccountPort.getCurrentUser();
    this.userName = user.name;
    this.availableBalance = this.userBalanceService.availableBalance;
  }
}
