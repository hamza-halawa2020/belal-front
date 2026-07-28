import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { getApiErrorMessage } from '../../../../shared/utils/api-error-message.util';
import { clearTransientMessage, showTransientMessage, TransientMessageTimeoutId } from '../../../../shared/utils/transient-message.util';
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
export class ContactPageComponent implements OnDestroy {
    private readonly destroyRef = inject(DestroyRef);

    readonly infoEmail = 'info@belal.com';
    readonly adminEmail = 'contact@belal.com';
    readonly phone1 = '+201034100565';
    readonly phone2 = '+201034100566';

    contactForm: FormGroup<ContactForm>;
    successMessage = '';
    errorMessage = '';
    isSubmitting = false;
    private successMessageTimeoutId: TransientMessageTimeoutId | null = null;
    private errorMessageTimeoutId: TransientMessageTimeoutId | null = null;

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

    ngOnDestroy(): void {
        clearTransientMessage(this.successMessageTimeoutId);
        clearTransientMessage(this.errorMessageTimeoutId);
    }

    clearMessages(): void {
        clearTransientMessage(this.successMessageTimeoutId);
        clearTransientMessage(this.errorMessageTimeoutId);
        this.successMessageTimeoutId = null;
        this.errorMessageTimeoutId = null;
        this.successMessage = '';
        this.errorMessage = '';
    }

    onSubmit(): void {
        if (this.contactForm.invalid) {
            this.contactForm.markAllAsTouched();
            this.showError(this.translate.instant('CONTACT_FORM_INVALID'));
            return;
        }

        this.isSubmitting = true;
        this.clearMessages();

        this.contactApi.sendMessage(this.getPayload()).pipe(
            finalize(() => {
                this.isSubmitting = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.contactForm.reset();
                this.showSuccess(this.translate.instant('CONTACT_SUCCESS_MESSAGE'));
            },
            error: (error: HttpErrorResponse) => {
                this.showError(getApiErrorMessage(error, this.translate.instant('CONTACT_UNEXPECTED_ERROR')));
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
        this.successMessageTimeoutId = showTransientMessage(
            message,
            value => {
                this.successMessage = value;
            },
            5000,
            this.successMessageTimeoutId
        );
    }

    private showError(message: string): void {
        this.errorMessageTimeoutId = showTransientMessage(
            message,
            value => {
                this.errorMessage = value;
            },
            5000,
            this.errorMessageTimeoutId
        );
    }

}
