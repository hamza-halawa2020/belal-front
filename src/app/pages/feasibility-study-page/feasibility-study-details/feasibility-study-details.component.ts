import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FeasibilityStudyService } from '../feasibility-study.service';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feasibility-study-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './feasibility-study-details.component.html',
  styleUrls: ['./feasibility-study-details.component.scss']
})
export class FeasibilityStudyDetailsComponent implements OnInit {
  study: any;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private feasibilityStudyService: FeasibilityStudyService
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
    this.feasibilityStudyService.getStudyDetails(id).subscribe({
      next: (response: any) => {
        this.study = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching feasibility study details:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imageName: string): string {
    if (!imageName) return '';
    return `${environment.imgUrl}storage/${imageName}`;
  }
}
