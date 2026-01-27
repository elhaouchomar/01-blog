import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { SidebarComponent } from '../../components/left-sidebar/left-sidebar';
import { RightSidebarComponent } from '../../components/right-sidebar/right-sidebar';
import { DataService } from '../../services/data.service';
import { User } from '../../models/data.models';
import { ModalService } from '../../services/modal.service';
import { getInitials } from '../../utils/string.utils';

@Component({
    selector: 'app-network',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, RightSidebarComponent],
    templateUrl: './network.html',
    styleUrl: './network.css'
})
export class Network implements OnInit {
    // 1. Use computed signal from DataService state instead of local array
    users = computed(() => {
        const allUsers = this.dataService.allUsers();
        const currentUser = this.dataService.currentUser();
        // Filter out current user and already followed users
        return allUsers.filter(user => user.id !== currentUser?.id && !user.isFollowing);
    });

    constructor(
        private dataService: DataService,
        protected modalService: ModalService,
        private router: Router
    ) { }

    ngOnInit() {
        // 2. Only fetch if cache is empty
        if (this.dataService.allUsers().length === 0) {
            this.dataService.loadUsers();
        }
    }

    // Use shared utility
    getInitials = getInitials;

    navigateToProfile(userId: number) {
        this.router.navigate(['/profile', userId]);
    }

    toggleSubscribe(user: User) {
        // Optimistic UI update - DataService refresh will eventually sync state
        // But for immediate feedback we might need to handle local state update if we rely purely on computed
        // However, user object reference in computed comes from DataService signals.
        // Mutating it here (user.isFollowing = true) works because objects are references, 
        // but cleaner way is to let DataService handle it.
        // For now, I'll keep optimistic update relative to the object instance.

        user.isFollowing = true;

        this.dataService.followUser(user.id).subscribe({
            next: () => {
                // Success - DataService.followUser refreshes profile, maybe users too? 
                // DataService.followUser calls getProfile().subscribe(). 
                // It doesn't explicitly call loadUsers().
                // I might need to trigger loadUsers() to sync the list or accept that we mutated the object.
            },
            error: (err) => {
                console.error('Error subscribing to user:', err);
                // Revert on error
                user.isFollowing = false;
            }
        });
    }

    removeFromSuggestions(user: User) {
        // Since we are using computed from DataService, we can't just filter a local array.
        // We either need to update DataService state or maintain a local "hidden" set.
        // For simplicity and standard behavior: filtered out items should probably physically remain 
        // until refreshed or we can use a local signal to specific hide IDs.

        // I will implement a local 'hiddenIds' signal to allow immediate removal from view
        this.hiddenUserIds.update(ids => [...ids, user.id]);
    }

    private hiddenUserIds = signal<number[]>([]);

    // Updated computed to include hidden IDs check
    displayUsers = computed(() => {
        const hidden = this.hiddenUserIds();
        return this.users().filter(u => !hidden.includes(u.id));
    });
}
