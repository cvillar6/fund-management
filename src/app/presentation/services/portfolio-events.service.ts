import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortfolioEventsService {
  readonly version = signal(0);

  notifyChanged(): void {
    this.version.update((current) => current + 1);
  }
}
