import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { ApiErrorResponse } from '../../../../core/api/api.types';
import { ContactApi } from '../../data-access/contact.api';
import { ContactMessagePayload } from '../../models/contact-message.model';

type ContactForm = {
    name: FormControl<string>;
    phone: FormControl<string>;
    message: FormControl<string>;
};

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [CommonModule, NgClass, ReactiveFormsModule, TranslateModule],
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
    readonly infoEmail = 'info@belal.com';
    readonly adminEmail = 'contact@belal.com';
    readonly phone1 = '+201034100565';
    readonly phone2 = '+201034100566';

    contactForm: FormGroup<ContactForm>;
    successMessage = '';
    errorMessage = '';
    isSubmitting = false;

    constructor(
        private readonly contactApi: ContactApi,
        private readonly fb: NonNullableFormBuilder,
        private readonly translate: TranslateService
    ) {
        this.contactForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    onSubmit(): void {
        if (this.contactForm.invalid) {
            this.contactForm.markAllAsTouched();
            this.showError(this.translate.instant('CONTACT_FORM_INVALID'));
            return;
        }

        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.contactApi.sendMessage(this.getPayload()).pipe(
            finalize(() => {
                this.isSubmitting = false;
            })
        ).subscribe({
            next: () => {
                this.contactForm.reset();
                this.showSuccess(this.translate.instant('CONTACT_SUCCESS_MESSAGE'));
            },
            error: (error: HttpErrorResponse) => {
                this.showError(this.getErrorMessage(error));
            }
        });
    }

    getFieldError(fieldName: keyof ContactForm): string {
        const field = this.contactForm.controls[fieldName];

        if (!field.errors || !field.touched) {
            return '';
        }

        if (field.errors['required']) {
            return this.translate.instant(`${fieldName.toUpperCase()}_REQUIRED`);
        }

        if (field.errors['minlength']) {
            return this.translate.instant(`${fieldName.toUpperCase()}_MIN_LENGTH`);
        }

        return '';
    }

    private getPayload(): ContactMessagePayload {
        return this.contactForm.getRawValue();
    }

    private showSuccess(message: string): void {
        this.successMessage = message;
        window.setTimeout(() => {
            this.successMessage = '';
        }, 5000);
    }

    private showError(message: string): void {
        this.errorMessage = message;
        window.setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        const responseError = error.error as ApiErrorResponse | undefined;

        if (responseError?.errors) {
            return Object.values(responseError.errors)
                .flat()
                .join(' | ');
        }

        return responseError?.message || this.translate.instant('CONTACT_UNEXPECTED_ERROR');
    }
}
