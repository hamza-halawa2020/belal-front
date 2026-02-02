import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-service-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {
    service: any;
    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private servicesService: ServicesService
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
        this.servicesService.getServiceDetails(id).subscribe({
            next: (response: any) => {
                this.service = response.data;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
            }
        });
    }
}
