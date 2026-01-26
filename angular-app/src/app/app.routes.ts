import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { NotFound } from './pages/not-found/not-found';
import { PostDetail } from './pages/post-detail/post-detail';

import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { DashboardOverview } from './pages/dashboard/overview/overview';
import { Posts } from './pages/dashboard/posts/posts';
import { Users } from './pages/dashboard/users/users';
import { Reports } from './pages/dashboard/reports/reports';
import { Analytics } from './pages/dashboard/analytics/analytics';
import { Network } from './pages/network/network';
import { Notifications } from './pages/notifications/notifications';
import { Settings } from './pages/settings/settings';

import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'profile', component: Profile },
    { path: 'profile/:id', component: Profile },
    { path: 'post/:id', component: PostDetail, canActivate: [authGuard] },

    { path: 'notifications', component: Notifications },
    { path: 'network', component: Network },
    { path: 'settings', component: Settings },
    {
        path: 'dashboard',
        component: DashboardLayout,
        canActivate: [adminGuard], // Protect with admin guard
        children: [
            { path: 'overview', component: DashboardOverview },
            { path: 'posts', component: Posts },
            { path: 'users', component: Users },
            { path: 'reports', component: Reports },
            { path: 'analytics', component: Analytics },
            { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
    },
    { path: '404', component: NotFound },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: NotFound } // Catch all other routes
];
