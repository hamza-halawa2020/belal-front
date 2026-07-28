import {
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const cookieService = inject(CookieService);
    const token = cookieService.get('token');

    if (!token) {
        return next(req);
    }

    return next(req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    }));
};
