import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { FeasibilityStudyRequestsApi } from '../../data-access/feasibility-study-requests.api';
import { FeasibilityStudyRequestPayload } from '../../models/feasibility-study-request.model';

@Component({
    selector: 'app-feasibility-study-request-form',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.scss']
})
export class FeasibilityStudyRequestFormComponent {
    requestForm: FormGroup;
    successMessage = '';
    errorMessage = '';
    isSubmitting = false;

    constructor(
        private readonly feasibilityStudyRequestsApi: FeasibilityStudyRequestsApi,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService
    ) {
        this.requestForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            message: ['', [Validators.required, Validators.minLength(20)]]
        });
    }

    onSubmit(): void {
        if (this.requestForm.invalid) {
            this.markFormGroupTouched();
            this.showError(this.translate.instant('FORM_INVALID'));
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.feasibilityStudyRequestsApi.submitRequest(this.getPayload()).pipe(
            finalize(() => {
                this.isSubmitting = false;
            })
        ).subscribe({
            next: () => {
                this.successMessage = this.translate.instant('REQUEST_SUCCESS_MESSAGE');
                this.requestForm.reset();
                setTimeout(() => {
                    this.successMessage = '';
                }, 7000);
            },
            error: (error: HttpErrorResponse) => {
                this.showError(this.getErrorMessage(error));
            }
        });
    }

    getFieldError(fieldName: string): string {
        const field = this.requestForm.get(fieldName);

        if (!field?.errors || !field.touched) {
            return '';
        }

        if (field.errors['required']) {
            return this.translate.instant(`${fieldName.toUpperCase()}_REQUIRED`);
        }

        if (field.errors['minlength']) {
            return this.translate.instant(`${fieldName.toUpperCase()}_MIN_LENGTH`, {
                length: field.errors['minlength'].requiredLength
            });
        }

        return '';
    }

    private getPayload(): FeasibilityStudyRequestPayload {
        return {
            name: this.requestForm.value.name,
            phone: this.requestForm.value.phone,
            message: this.requestForm.value.message
        };
    }

    private markFormGroupTouched(): void {
        Object.values(this.requestForm.controls).forEach(control => {
            control.markAsTouched();
        });
    }

    private showError(message: string): void {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        const responseError = error.error;

        if (responseError?.errors) {
            return Object.values(responseError.errors)
                .flat()
                .join(' | ');
        }

        if (responseError?.message) {
            return responseError.message;
        }

        return this.translate.instant('REQUEST_UNEXPECTED_ERROR');
    }
}
