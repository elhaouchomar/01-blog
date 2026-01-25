import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../models/data.models';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-dropdown-notif',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dropdown-notif.html',
    styleUrl: './dropdown-notif.css'
})
export class DropdownNotifComponent {
    @Input() notifications: Notification[] = [];
    @Output() onClose = new EventEmitter<void>();
    @Output() onNotificationClick = new EventEmitter<Notification>();
    @Output() onMarkAllRead = new EventEmitter<void>();

    isOpen = false; // Controlled by parent via *ngIf usually, but kept for internal logic if needed? 
    // Navbar uses *ngIf="isNotificationsOpen". So this component is created/destroyed.

    constructor(private router: Router) {}

    // Helper to format date
    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    handleActorClick(notification: Notification, event: Event) {
        event.stopPropagation();
        if (notification.actorId) {
            this.router.navigate(['/profile', notification.actorId]);
            this.onClose.emit();
        }
    }
}
