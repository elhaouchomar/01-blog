import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { ModalService } from '../../../services/modal.service';
import { usePagination } from '../../../utils/pagination.utils';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  searchQuery = signal('');
  statusFilter = signal('all');

  filteredUsers = computed(() => {
    let filtered = [...this.dataService.allUsers()];
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    // Exclude current admin
    const currentAdminId = this.dataService.currentUser()?.id;
    filtered = filtered.filter(u => u.id !== currentAdminId);

    // Search filter
    if (query) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.role?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (status !== 'all') {
      if (status === 'banned') {
        filtered = filtered.filter(u => u.banned === true);
      } else if (status === 'active') {
        filtered = filtered.filter(u => u.banned !== true);
      } else if (status === 'admins') {
        filtered = filtered.filter(u => u.role === 'ADMIN');
      }
    }

    return filtered;
  });

  // Use standardized pagination logic
  pagination = usePagination(this.filteredUsers);

  isLoading = computed(() => this.dataService.allUsers().length === 0 && !this.dataService.dashboardStats());

  constructor(public dataService: DataService, public modalService: ModalService) { }

  ngOnInit() {
    if (this.dataService.allUsers().length === 0) {
      this.dataService.loadUsers();
    }
  }

  onSearch(event: any) {
    this.searchQuery.set(event.target.value);
    this.pagination.goToPage(1); // Reset to page 1 using utility
  }

  setStatusFilter(status: string) {
    this.statusFilter.set(status);
    this.pagination.goToPage(1); // Reset to page 1 using utility
  }

  toggleBan(user: any) {
    this.modalService.open('confirm-ban', user);
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      this.dataService.deleteUserAction(user.id).subscribe();
    }
  }

  editUser(user: any) {
    this.modalService.open('admin-edit-user', user);
  }
}
