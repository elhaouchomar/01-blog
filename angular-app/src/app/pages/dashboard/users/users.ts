import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery = '';
  statusFilter = 'all';
  isLoading = true;

  constructor(private dataService: DataService, public modalService: ModalService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.users];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      if (this.statusFilter === 'banned') {
        filtered = filtered.filter(u => u.banned);
      } else if (this.statusFilter === 'active') {
        filtered = filtered.filter(u => !u.banned);
      } else if (this.statusFilter === 'moderators') {
        filtered = filtered.filter(u => u.role === 'ADMIN');
      }
    }

    this.filteredUsers = filtered;
  }

  toggleBan(user: any) {
    this.dataService.toggleBan(user.id).subscribe({
      next: (updatedUser) => {
        user.banned = updatedUser.banned;
        this.applyFilters();
      },
      error: (err) => console.error('Error toggling ban', err)
    });
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      this.dataService.deleteUserAction(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.applyFilters();
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  editUser(user: any) {
    this.modalService.open('edit-profile', user);
  }
}
