import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../core/api/api.types';

export function getApiErrorMessage(error: HttpErrorResponse, fallbackMessage: string): string {
    const responseError = error.error as ApiErrorResponse | undefined;

    if (responseError?.errors) {
        return Object.values(responseError.errors)
            .flat()
            .join(' | ');
    }

    return responseError?.message || fallbackMessage;
}
