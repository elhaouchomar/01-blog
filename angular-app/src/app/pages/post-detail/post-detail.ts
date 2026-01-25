import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Post, Comment } from '../../models/data.models';

import { NavbarComponent } from '../../components/navbar/navbar';
import { SidebarComponent } from '../../components/left-sidebar/left-sidebar';
import { RightSidebarComponent } from '../../components/right-sidebar/right-sidebar';

@Component({
    selector: 'app-post-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, SidebarComponent, RightSidebarComponent],
    templateUrl: './post-detail.html',
    styleUrl: './post-detail.css'
})
export class PostDetail implements OnInit {
    post = signal<Post | null>(null);
    comments = signal<Comment[]>([]);
    commentText = '';
    currentUser: any = null;
    isExpanded = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService
    ) {
        this.dataService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        const postId = this.route.snapshot.paramMap.get('id');
        if (postId) {
            this.loadPost(+postId);
        }
    }

    loadPost(id: number) {
        this.dataService.getPost(id).subscribe({
            next: (post: Post) => {
                this.post.set(post);
                this.loadComments(id);
            },
            error: (err: any) => console.error('Error loading post:', err)
        });
    }

    loadComments(postId: number) {
        this.dataService.getCommentsForPost(postId).subscribe({
            next: (comments: Comment[]) => this.comments.set(comments),
            error: (err: any) => console.error('Error loading comments:', err)
        });
    }

    toggleLike() {
        const currentPost = this.post();
        if (!currentPost || !currentPost.id) return;

        this.dataService.toggleLike(currentPost.id).subscribe({
            next: (updatedPost) => this.post.set(updatedPost),
            error: (err) => console.error('Error liking post:', err)
        });
    }

    submitComment() {
        const currentPost = this.post();
        if (!this.commentText.trim() || !currentPost) return;

        this.dataService.addComment(currentPost.id, this.commentText).subscribe({
            next: (comment) => {
                this.comments.update(comments => [comment, ...comments]);
                this.commentText = ''; // Clear input after submission
            },
            error: (err) => console.error('Error posting comment:', err)
        });
    }

    handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.submitComment();
        }
    }

    isVideo(url: string | undefined): boolean {
        if (!url) return false;
        const u = url.toLowerCase();
        return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.mov');
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
    }

    goBack() {
        this.router.navigate(['/home']);
    }
}
