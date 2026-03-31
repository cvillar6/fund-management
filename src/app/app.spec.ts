import { TestBed } from '@angular/core/testing';

import { USER_ACCOUNT_PORT } from './application/ports/user-account.port';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: USER_ACCOUNT_PORT,
          useValue: {
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
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
