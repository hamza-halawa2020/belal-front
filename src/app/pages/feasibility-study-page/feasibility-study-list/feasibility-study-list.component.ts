import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeasibilityStudyService } from '../feasibility-study.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';

@Component({
  selector: 'app-feasibility-study-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
  templateUrl: './feasibility-study-list.component.html',
  styleUrls: ['./feasibility-study-list.component.scss']
})
export class FeasibilityStudyListComponent implements OnInit {
  studies: any[] = [];
  isLoading: boolean = true;
  meta: any;

  constructor(private feasibilityStudyService: FeasibilityStudyService) { }

  ngOnInit(): void {
    this.fetchStudies();
  }

  fetchStudies(page: number = 1) {
    this.isLoading = true;
    this.feasibilityStudyService.getStudiesList(page).subscribe({
      next: (response: any) => {
        this.studies = response.data;
        this.meta = response.meta;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error: any) => {
        console.error('Error fetching feasibility studies:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
      this.fetchStudies(page);
    }
  }
}
