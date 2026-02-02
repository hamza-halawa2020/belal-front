import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { TranslateModule } from '@ngx-translate/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, ContentCardComponent],
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
  category: any;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
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
    this.categoriesService.getCategoryDetails(id).subscribe({
      next: (response: any) => {
        this.category = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }
}