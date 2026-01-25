import { Component, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { DataService } from '../../services/data.service';
import { User, Post } from '../../models/data.models';
import { ModalService } from '../../services/modal.service';
import { SidebarComponent } from '../../components/left-sidebar/left-sidebar';
import { RightSidebarComponent } from '../../components/right-sidebar/right-sidebar';
import { PostCardComponent } from '../../components/post-card/post-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RightSidebarComponent, CommonModule, RouterModule, PostCardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  isMenuOpen = false;
  user: User | null = null;
  posts: Post[] = [];
  isLoading = false;
  activeTab = 'Posts';
  private previousModalState: string | null = null;

  setTab(tab: string) {
    this.activeTab = tab;
    // Logic for switching content would go here
    this.cdr.detectChanges();
  }

  constructor(
    private dataService: DataService,
    protected modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Load user based on route parameter or current user
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        // Load specific user profile
        this.loadUserProfile(parseInt(userId));
      } else {
        // Load current user profile
        this.dataService.currentUser$.subscribe(user => {
          this.user = user;
          if (this.user && this.user.id > 0) {
            setTimeout(() => {
              this.loadPosts();
            }, 100);
          }
        });
      }
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
        if (this.user && this.user.id) {
          this.loadPosts();
        }
      }
      this.previousModalState = currentModal;
    });
  }

  ngOnInit() {
    // User loading is handled in constructor via route params
  }

  loadUserProfile(userId: number) {
    this.isLoading = true;
    this.dataService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadPosts();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.isLoading = false;
        // Redirect to own profile if user not found
        this.router.navigate(['/profile']);
        this.cdr.detectChanges();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get isOwnProfile(): boolean {
    const currentUser = this.dataService.getCurrentUser();
    return !!(currentUser && this.user && currentUser.id === this.user.id);
  }

  loadPosts() {
    if (!this.user || !this.user.id) return;

    this.isLoading = true;
    this.dataService.getUserPosts(this.user.id).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading user posts:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reportUser() {
    this.isMenuOpen = false;
    if (this.user) {
      const reportData = { ...this.user, reportType: 'user' };
      this.modalService.open('report', reportData);
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }
}
