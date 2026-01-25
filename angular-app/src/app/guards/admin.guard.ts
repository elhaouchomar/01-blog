import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { DataService } from '../services/data.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const dataService = inject(DataService);
    const router = inject(Router);

    const currentUser = dataService.getCurrentUser();

    // Check if user is admin
    if (currentUser && currentUser.role === 'ADMIN') {
        return true;
    }

    // Redirect to 404 if not admin
    router.navigate(['/404']);
    return false;
};
