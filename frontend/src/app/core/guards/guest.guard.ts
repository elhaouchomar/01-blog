import { inject, Injector } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { DataService } from '../services/data.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, map } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
    const dataService = inject(DataService);
    const router = inject(Router);
    const injector = inject(Injector);

    // Wait until the initial auth check completes to avoid flicker.
    return toObservable(dataService.authChecked, { injector }).pipe(
        filter(checked => checked === true),
        take(1),
        map(() => {
            if (dataService.isLoggedIn()) {
                router.navigate(['/home']);
                return false;
            }
            return true;
        })
    );
};
