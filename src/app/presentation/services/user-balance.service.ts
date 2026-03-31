import { Inject, Injectable, signal } from '@angular/core';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../application/ports/user-account.port';

@Injectable({ providedIn: 'root' })
export class UserBalanceService {
  readonly availableBalance = signal(0);

  constructor(@Inject(USER_ACCOUNT_PORT) private readonly userAccountPort: UserAccountPort) {
    this.refresh();
  }

  refresh(): void {
    this.availableBalance.set(this.userAccountPort.getCurrentUser().balance);
  }
}
