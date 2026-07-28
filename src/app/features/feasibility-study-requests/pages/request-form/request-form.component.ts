import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { getApiErrorMessage } from '../../../../shared/utils/api-error-message.util';
import { FeasibilityStudyRequestsApi } from '../../data-access/feasibility-study-requests.api';
import { FeasibilityStudyRequestPayload } from '../../models/feasibility-study-request.model';

type FeasibilityStudyRequestForm = {
    name: FormControl<string>;
    phone: FormControl<string>;
    message: FormControl<string>;
};

@Component({
    selector: 'app-feasibility-study-request-form',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.scss']
})
export class FeasibilityStudyRequestFormComponent {
    requestForm: FormGroup<FeasibilityStudyRequestForm>;
    successMessage = '';
    errorMessage = '';
    isSubmitting = false;

    constructor(
        private readonly feasibilityStudyRequestsApi: FeasibilityStudyRequestsApi,
        private readonly fb: NonNullableFormBuilder,
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
                this.requestForm.reset();
                this.showSuccess(this.translate.instant('REQUEST_SUCCESS_MESSAGE'));
            },
            error: (error: HttpErrorResponse) => {
                this.showError(getApiErrorMessage(error, this.translate.instant('REQUEST_UNEXPECTED_ERROR')));
            }
        });
    }

    getFieldError(fieldName: keyof FeasibilityStudyRequestForm): string {
        const field = this.requestForm.controls[fieldName];

        if (!field.errors || !field.touched) {
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
        return this.requestForm.getRawValue();
    }

    private markFormGroupTouched(): void {
        this.requestForm.markAllAsTouched();
    }

    private showSuccess(message: string): void {
        this.successMessage = message;
        window.setTimeout(() => {
            this.successMessage = '';
        }, 7000);
    }

    private showError(message: string): void {
        this.errorMessage = message;
        window.setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }

}
