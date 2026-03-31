import { Injectable } from '@angular/core';

import { UserAccountPort } from '../../application/ports/user-account.port';
import { User } from '../../domain/entities/user.entity';
import { MOCK_USER } from '../config/user-mock';

@Injectable()
export class UserAccountInMemoryAdapter implements UserAccountPort {
  private user: User = { ...MOCK_USER };

  getCurrentUser(): User {
    return { ...this.user };
  }

  updateBalance(newBalance: number): User {
    this.user = {
      ...this.user,
      balance: newBalance,
    };

    return { ...this.user };
  }
}
