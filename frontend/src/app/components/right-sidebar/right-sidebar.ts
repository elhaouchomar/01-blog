import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/data.models';
import { getInitials } from '../../utils/string.utils';

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
        // Don't reload on user change to avoid immediate removal
    }

    loadSuggestions() {
        this.dataService.getUsers().subscribe({
            next: (users) => {
                // Get 3 random users or just the first 3 that aren't the current user and not followed
                const currentUser = this.dataService.getCurrentUser();
                this.suggestedUsers = users
                    .filter(u => String(u.id) !== String(currentUser?.id) && !u.isFollowing)
                    .slice(0, 4);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading suggestions:', err)
        });
    }

    toggleSubscribe(user: any, event: Event) {
        event.stopPropagation();
        // Update locally for immediate UI feedback
        user.isFollowing = true;
        this.cdr.detectChanges();

        this.dataService.followUser(user.id).subscribe({
            next: () => {
                // Successfully subscribed
            },
            error: (err) => {
                console.error('Error subscribing:', err);
                // Revert on error
                user.isFollowing = false;
                this.cdr.detectChanges();
            }
        });
    }

    removeFromSuggestions(userId: number) {
        this.suggestedUsers = this.suggestedUsers.filter(u => u.id !== userId);
        this.cdr.detectChanges();
    }

    // Use shared utility
    getInitials = getInitials;
}
