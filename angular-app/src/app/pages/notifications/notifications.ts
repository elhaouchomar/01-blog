import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { SidebarComponent } from '../../components/left-sidebar/left-sidebar';
import { RightSidebarComponent } from '../../components/right-sidebar/right-sidebar';
import { DataService } from '../../services/data.service';
import { Notification as AppNotification } from '../../models/data.models';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [NavbarComponent, SidebarComponent, RightSidebarComponent, CommonModule, RouterModule],
    templateUrl: './notifications.html',
    styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
    activeFilter: string = 'All';
    notifications: AppNotification[] = [];
    filteredNotifications: AppNotification[] = [];

    constructor(
        private dataService: DataService,
        private router: Router,
        protected modalService: ModalService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // Load immediately
        this.loadNotifications();

        // Reload when user changes
        this.dataService.currentUser$.subscribe(user => {
            if (user) {
                this.loadNotifications();
            }
        });
    }

    loadNotifications() {
        this.dataService.getNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.filterNotifications();
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading notifications', err)
        });
    }

    setFilter(filter: string) {
        this.activeFilter = filter;
        this.filterNotifications();
    }

    filterNotifications() {
        if (this.activeFilter === 'All') {
            this.filteredNotifications = this.notifications;
        } else if (this.activeFilter === 'Unread') {
            this.filteredNotifications = this.notifications.filter((n: AppNotification) => !n.isRead);
        } else {
            const map: { [key: string]: string } = {
                'Comments': 'COMMENT',
                'Likes': 'LIKE',
                'Follows': 'FOLLOW',
                'Events': 'SYSTEM'
            };
            const type = map[this.activeFilter];
            if (type) {
                this.filteredNotifications = this.notifications.filter((n: AppNotification) => n.type === type);
            } else {
                this.filteredNotifications = [];
            }
        }
    }

    markAllAsRead() {
        this.dataService.markAllAsRead().subscribe(() => {
            this.notifications.forEach((n: AppNotification) => n.isRead = true);
            this.filterNotifications();
        });
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.isRead).length;
    }

    handleNotificationClick(notification: AppNotification, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        
        // Mark as read if not already read
        if (!notification.isRead) {
            this.dataService.markAsRead(notification.id).subscribe(() => {
                notification.isRead = true;
                this.cdr.detectChanges();
            });
        }

        // Navigate based on notification type
        if (notification.type === 'LIKE' || notification.type === 'COMMENT') {
            // Redirect to post detail page
            if (notification.entityId) {
                this.router.navigate(['/post', notification.entityId]);
            }
        } else if (notification.type === 'FOLLOW') {
            // For FOLLOW, entityId is the actor's (follower's) ID
            // Redirect to their profile
            if (notification.actorId) {
                this.router.navigate(['/profile', notification.actorId]);
            } else if (notification.entityId) {
                // Fallback: use entityId if actorId is not available
                this.router.navigate(['/profile', notification.entityId]);
            }
        }
    }

    handleActorClick(notification: AppNotification, event: Event) {
        event.stopPropagation();
        if (notification.actorId) {
            this.router.navigate(['/profile', notification.actorId]);
        }
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
}
