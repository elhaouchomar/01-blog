import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ModalService } from '../../services/modal.service';
import { DropdownNotifComponent } from '../dropdown-notif/dropdown-notif';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, DropdownNotifComponent],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
    isNotificationsOpen = false;
    isProfileOpen = false;
    isNotificationRoute = false;

    // Notifications
    notifications: any[] = [];

    constructor(
        public modalService: ModalService,
        public dataService: DataService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        // Track current route to highlight notification icon correctly
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.isNotificationRoute = event.urlAfterRedirects === '/notifications';
            this.cdr.detectChanges();
        });
    }

    currentUser: any;

    ngOnInit() {
        if (localStorage.getItem('auth_token')) {
            this.loadNotifications();
        }

        this.dataService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) this.loadNotifications();
            this.cdr.detectChanges();
        });
    }

    loadNotifications() {
        this.dataService.getNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading notifications', err)
        });
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.isRead).length;
    }

    handleNotificationClick(notification: any, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        
        // Mark as read first
        if (!notification.isRead) {
            this.dataService.markAsRead(notification.id).subscribe(() => {
                notification.isRead = true;
            });
        }

        // Navigate based on notification type
        if (notification.type === 'LIKE' || notification.type === 'COMMENT') {
            // Redirect to post detail page
            if (notification.entityId) {
                this.router.navigate(['/post', notification.entityId]);
                this.isNotificationsOpen = false; // Close dropdown
            }
        } else if (notification.type === 'FOLLOW') {
            // For FOLLOW, redirect to actor's profile
            if (notification.actorId) {
                this.router.navigate(['/profile', notification.actorId]);
                this.isNotificationsOpen = false; // Close dropdown
            } else if (notification.entityId) {
                // Fallback: use entityId if actorId is not available
                this.router.navigate(['/profile', notification.entityId]);
                this.isNotificationsOpen = false; // Close dropdown
            }
        }
    }

    handleActorClick(notification: any, event: Event) {
        event.stopPropagation();
        if (notification.actorId) {
            this.router.navigate(['/profile', notification.actorId]);
            this.isNotificationsOpen = false; // Close dropdown
        }
    }

    markAllRead() {
        this.dataService.markAllAsRead().subscribe(() => {
            this.notifications.forEach(n => n.isRead = true);
        });
    }

    get isAdmin(): boolean {
        return this.currentUser?.isAdmin || false;
    }

    get user(): any {
        return this.currentUser;
    }

    toggleUserMenu() {
        this.toggleProfile();
    }

    toggleNotifications() {
        if (window.innerWidth < 1024) {
            this.router.navigate(['/notifications']);
            this.isNotificationsOpen = false;
        } else {
            this.isNotificationsOpen = !this.isNotificationsOpen;
            if (this.isNotificationsOpen) {
                this.isProfileOpen = false; // Close profile when notifications open
            }
        }
    }

    toggleProfile() {
        this.isProfileOpen = !this.isProfileOpen;
        this.isNotificationsOpen = false; // Close others
    }
}
