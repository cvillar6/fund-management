import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Fund } from '../../../domain/entities/fund.entity';

@Component({
  selector: 'app-funds-list',
  imports: [TableModule, CurrencyPipe],
  templateUrl: './funds-list.component.html',
})
export class FundsListComponent {
  @Input({ required: true }) funds: Fund[] = [];
}
