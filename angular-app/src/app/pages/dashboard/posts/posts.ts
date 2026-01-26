import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  searchQuery = signal('');
  statusFilter = signal('');
  sortBy = signal('newest');
  currentPage = signal(1);
  pageSize = 10;

  filteredPosts = computed(() => {
    let filtered = [...this.dataService.posts()];
    const query = this.searchQuery().toLowerCase();

    // Search filter
    if (query) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.user?.name?.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (this.sortBy() === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      if (this.sortBy() === 'most-liked') {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });

    return filtered;
  });

  paginatedPosts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPosts().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredPosts().length / this.pageSize) || 1;
  });

  isLoading = computed(() => this.dataService.posts().length === 0 && !this.dataService.dashboardStats());

  constructor(public dataService: DataService, public modalService: ModalService) { }

  ngOnInit() {
    if (this.dataService.posts().length === 0) {
      this.dataService.loadPosts();
    }
  }

  onFilterChange() {
    this.currentPage.set(1); // Reset to page 1 when filters change
  }

  reviewPost(post: any) {
    this.modalService.open('post-details', post);
  }

  deletePost(post: any) {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      this.dataService.deletePost(post.id).subscribe();
    }
  }

  exportPosts() {
    console.log('Exporting posts...');
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getPageStart() {
    if (this.filteredPosts().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  getPageEnd() {
    if (this.filteredPosts().length === 0) return 0;
    return Math.min(this.currentPage() * this.pageSize, this.filteredPosts().length);
  }
}
