import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../../application/ports/user-account.port';
import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-header',
  imports: [CurrencyPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  userName = '';
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);
  private readonly userBalanceService: UserBalanceService = inject(UserBalanceService);
  readonly availableBalance: Signal<number> = this.userBalanceService.availableBalance;

  ngOnInit(): void {
    const user = this.userAccountPort.getCurrentUser();
    this.userName = user.name;
  }
}
