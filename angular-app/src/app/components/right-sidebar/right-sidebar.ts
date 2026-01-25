import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/data.models';

@Component({
    selector: 'app-right-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './right-sidebar.html',
    styleUrls: ['./right-sidebar.css']
})
export class RightSidebarComponent implements OnInit {
    suggestedUsers: User[] = [];

    constructor(
        private dataService: DataService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadSuggestions();
        this.dataService.currentUser$.subscribe(() => {
            this.loadSuggestions();
        });
    }

    loadSuggestions() {
        this.dataService.getUsers().subscribe({
            next: (users) => {
                // Get 3 random users or just the first 3 that aren't the current user
                const currentUser = this.dataService.getCurrentUser();
                this.suggestedUsers = users
                    .filter(u => String(u.id) !== String(currentUser?.id))
                    .slice(0, 4);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading suggestions:', err)
        });
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    toggleSubscribe(event: any) {
        const btn = event.currentTarget;
        btn.classList.toggle('subscribed');
        const isSubscribed = btn.classList.contains('subscribed');

        const textSpan = btn.querySelector('span:last-child');
        const iconSpan = btn.querySelector('.material-symbols-outlined');

        if (isSubscribed) {
            if (textSpan) textSpan.innerText = 'Subscribed';
            if (iconSpan) iconSpan.innerText = 'check';
        } else {
            if (textSpan) textSpan.innerText = 'Subscribe';
            if (iconSpan) iconSpan.innerText = 'add';
        }
    }
}
