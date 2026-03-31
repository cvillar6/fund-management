import { CurrencyPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../../application/ports/user-account.port';

@Component({
  selector: 'app-header',
  imports: [CurrencyPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly userName: string;
  readonly availableBalance: number;

  constructor(@Inject(USER_ACCOUNT_PORT) private readonly userAccountPort: UserAccountPort) {
    const user = this.userAccountPort.getCurrentUser();
    this.userName = user.name;
    this.availableBalance = user.balance;
  }
}
