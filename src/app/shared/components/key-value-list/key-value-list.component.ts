import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FinancialMetricItem } from '../../utils/financial-metrics.util';

@Component({
    selector: 'app-key-value-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './key-value-list.component.html',
    styleUrls: ['./key-value-list.component.scss']
})
export class KeyValueListComponent {
    @Input() items: FinancialMetricItem[] = [];
}
