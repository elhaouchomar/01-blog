import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { ModalService } from '../../../services/modal.service';
import { usePagination } from '../../../utils/pagination.utils';

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

  // Use standardized pagination logic
  pagination = usePagination(this.filteredPosts);

  isLoading = computed(() => this.dataService.posts().length === 0 && !this.dataService.dashboardStats());

  constructor(public dataService: DataService, public modalService: ModalService) { }

  ngOnInit() {
    if (this.dataService.posts().length === 0) {
      this.dataService.loadPosts();
    }
  }

  onFilterChange() {
    this.pagination.goToPage(1); // Reset to page 1 using utility
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
}
