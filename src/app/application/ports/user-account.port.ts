import { InjectionToken } from '@angular/core';

import { User } from '../../domain/entities/user.entity';

export interface UserAccountPort {
  getCurrentUser(): User;
  updateBalance(newBalance: number): User;
}

export const USER_ACCOUNT_PORT = new InjectionToken<UserAccountPort>('USER_ACCOUNT_PORT');
