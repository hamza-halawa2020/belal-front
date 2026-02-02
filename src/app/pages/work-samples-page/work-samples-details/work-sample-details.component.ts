import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkSamplesService } from '../work-samples.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-work-sample-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './work-sample-details.component.html',
    styleUrls: ['./work-sample-details.component.scss']
})
export class WorkSampleDetailsComponent implements OnInit {
    workSample: any;
    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private workSamplesService: WorkSamplesService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.fetchDetails(id);
            }
        });
    }

    fetchDetails(id: string) {
        this.isLoading = true;
        this.workSamplesService.getWorkSampleDetails(id).subscribe({
            next: (response: any) => {
                this.workSample = response.data;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
            }
        });
    }
}
