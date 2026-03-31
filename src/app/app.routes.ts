import { Routes } from '@angular/router';

import { HomePageComponent } from './presentation/pages/home/home.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'transactions', redirectTo: '', pathMatch: 'full' },
];
