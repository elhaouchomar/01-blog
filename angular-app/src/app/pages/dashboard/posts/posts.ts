import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchQuery = '';
  statusFilter = '';
  sortBy = 'newest';
  isLoading = true;

  constructor(private dataService: DataService, public modalService: ModalService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.dataService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading posts', err);
        this.isLoading = false;
      }
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.posts];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.author.name.toLowerCase().includes(query)
      );
    }

    // Status filter - note: backend DTO might not have status yet, using category as proxy or assuming future field
    if (this.statusFilter) {
      // Logic for status filtering if applicable
    }

    // Sorting
    filtered.sort((a, b) => {
      if (this.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (this.sortBy === 'most-liked') {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      return 0;
    });

    this.filteredPosts = filtered;
  }

  reviewPost(post: any) {
    this.modalService.open('post-details', post);
  }

  deletePost(post: any) {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      this.dataService.deletePost(post.id).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
          this.applyFilters();
        },
        error: (err) => console.error('Error deleting post', err)
      });
    }
  }

  exportPosts() {
    console.log('Exporting posts...');
    // Logic for exporting CSV
  }
}
