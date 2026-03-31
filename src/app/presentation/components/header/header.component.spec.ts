import { TestBed } from '@angular/core/testing';

import { USER_ACCOUNT_PORT, UserAccountPort } from '../../../application/ports/user-account.port';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  const userAccountPortMock: UserAccountPort = {
    getCurrentUser: () => ({
      id: '1234567890',
      name: 'Camilo Villa',
      balance: 500000,
    }),
    updateBalance: (newBalance: number) => ({
      id: '1234567890',
      name: 'Camilo Villa',
      balance: newBalance,
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: USER_ACCOUNT_PORT, useValue: userAccountPortMock }],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render user name and available balance', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hello, Camilo Villa');
    expect(compiled.textContent).toContain('Available balance:');
    expect(compiled.textContent).toMatch(/500/);
  });
});
