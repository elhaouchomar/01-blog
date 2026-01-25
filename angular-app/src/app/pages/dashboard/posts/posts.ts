import { Component, OnInit, effect } from '@angular/core';
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
  private previousModalState: string | null = null;

  constructor(protected modalService: ModalService, private dataService: DataService) {
    // Reload posts when post-related modals close
    effect(() => {
      const currentModal = this.modalService.activeModal();
      if (this.previousModalState && 
          (this.previousModalState === 'create-post' || 
           this.previousModalState === 'edit-post' || 
           this.previousModalState === 'confirm-delete' ||
           this.previousModalState === 'confirm-delete-post') &&
          currentModal === null) {
        // Modal was closed, reload posts
        this.loadPosts();
      }
      this.previousModalState = currentModal;
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.dataService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filteredPosts = posts;
      },
      error: (err) => console.error('Error loading posts', err)
    });
  }

  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p =>
      p.title?.toLowerCase().includes(query) ||
      p.content?.toLowerCase().includes(query)
    );
  }

  openPost(post: any) {
    this.modalService.open('post-details', post);
  }

  deletePost(post: any) {
    this.modalService.open('confirm-delete', post); // Use confirm-delete key
  }
}
