import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
    users: any[] = [];
    filteredUsers: any[] = [];
    searchQuery = '';

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.dataService.getUsers().subscribe({
            next: (users) => {
                this.users = users; // Assuming User[] is returned
                this.filteredUsers = users;
            },
            error: (err) => console.error('Error loading users', err)
        });
    }

    filterUsers() {
        const query = this.searchQuery.toLowerCase();
        this.filteredUsers = this.users.filter(u =>
            u.name.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query)
        );
    }

    filterBy(status: string) {
        if (status === 'All') {
            this.filteredUsers = this.users;
        } else if (status === 'Banned') {
            // Check if isBanned property exists
            this.filteredUsers = this.users.filter(u => u.isBanned);
        }
    }

    deleteUser(user: any) {
        if (confirm(`Delete user ${user.name}? This cannot be undone.`)) {
            this.dataService.deleteUserAction(user.id).subscribe({
                next: () => {
                    this.users = this.users.filter(u => u.id !== user.id);
                    this.filterUsers();
                },
                error: (err) => alert('Error deleting user')
            });
        }
    }

    toggleBan(user: any) {
        // Optimistic update
        user.isBanned = !user.isBanned;
        this.dataService.toggleBan(user.id).subscribe({
            error: (err) => {
                user.isBanned = !user.isBanned; // Revert
                console.error('Error banning user', err);
            }
        });
    }
}
