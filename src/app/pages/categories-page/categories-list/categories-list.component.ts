import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories: any[] = [];
  isLoading: boolean = true;
  meta: any;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(page: number = 1) {
    this.isLoading = true;
    this.categoriesService.getCategoriesList(page).subscribe({
      next: (response: any) => {
        this.categories = response.data;
        this.meta = response.meta;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
      this.fetchCategories(page);
    }
  }
}