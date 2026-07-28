import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-check-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './check-list.component.html',
    styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent {
    @Input() items: string[] = [];
}
