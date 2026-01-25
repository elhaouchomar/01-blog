import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { DataService } from '../services/data.service';

export const authGuard: CanActivateFn = (route, state) => {
    const dataService = inject(DataService);
    const router = inject(Router);

    // Basic auth check: presence of token in localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
        return true;
    }

    // Not authenticated -> redirect to login
    router.navigate(['/login']);
    return false;
};
