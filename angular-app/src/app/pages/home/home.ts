import { Component, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { SidebarComponent } from '../../components/left-sidebar/left-sidebar';
import { RightSidebarComponent } from '../../components/right-sidebar/right-sidebar';
import { PostCardComponent } from '../../components/post-card/post-card';
import { DataService } from '../../services/data.service';
import { Post, User } from '../../models/data.models';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    RightSidebarComponent,
    PostCardComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  currentUser: User | null = null;
  posts: Post[] = [];
  isLoading = false;
  private previousModalState: string | null = null;

  constructor(
    private dataService: DataService,
    public modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Always reload posts when user state changes to ensure feed consistency
      // Use timeout to avoid race conditions with view init
      setTimeout(() => {
        this.loadPosts();
      }, 100);
    });

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
    this.isLoading = true;
    this.dataService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
