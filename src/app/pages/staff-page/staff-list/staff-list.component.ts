import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StaffService } from '../staff.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  staff: any[] = [];
  isLoading: boolean = true;
  meta: any;

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.fetchStaff();
  }

  fetchStaff(page: number = 1) {
    this.isLoading = true;
    this.staffService.getStaffList(page).subscribe({
      next: (response: any) => {
        this.staff = response.data;
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
      this.fetchStaff(page);
    }
  }
}