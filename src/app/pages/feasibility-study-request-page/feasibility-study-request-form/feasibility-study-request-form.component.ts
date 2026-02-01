import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeasibilityStudyRequestService } from '../feasibility-study-request.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
  selector: 'app-feasibility-study-request-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './feasibility-study-request-form.component.html',
  styleUrls: ['./feasibility-study-request-form.component.scss']
})
export class FeasibilityStudyRequestFormComponent implements OnInit {
  requestForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private feasibilityStudyRequestService: FeasibilityStudyRequestService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.requestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.requestForm.invalid) {
      this.markFormGroupTouched();
      this.translate.get('FORM_INVALID').subscribe((translation: string) => {
        this.errorMessage = translation;
      });
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.feasibilityStudyRequestService.submitRequest(this.requestForm.value).subscribe({
      next: (response) => {
        this.translate.get('REQUEST_SUCCESS_MESSAGE').subscribe((translation: string) => {
          this.successMessage = translation;
        });
        this.requestForm.reset();
        this.isSubmitting = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 7000);
      },

      error: (error) => {
        this.isSubmitting = false;
        if (error.error?.errors) {
          const errors = error.error.errors;
          const errorMessages = Object.keys(errors).map(key => 
            errors[key].join(', ')
          ).join(' | ');
          this.errorMessage = errorMessages;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.translate.get('REQUEST_UNEXPECTED_ERROR').subscribe((translation: string) => {
            this.errorMessage = translation;
          });
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.requestForm.controls).forEach(key => {
      const control = this.requestForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.requestForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return this.translate.instant(`${fieldName.toUpperCase()}_REQUIRED`);
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return this.translate.instant(`${fieldName.toUpperCase()}_MIN_LENGTH`, { length: requiredLength });
      }
    }
    return '';
  }
}