import { inject, Injectable, signal } from '@angular/core';
import { USER_ACCOUNT_PORT, UserAccountPort } from '../../application/ports/user-account.port';

@Injectable({ providedIn: 'root' })
export class UserBalanceService {
  readonly availableBalance = signal(0);
  private readonly userAccountPort: UserAccountPort = inject(USER_ACCOUNT_PORT);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.availableBalance.set(this.userAccountPort.getCurrentUser().balance);
  }
}
