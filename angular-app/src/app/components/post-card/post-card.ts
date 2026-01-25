import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Post } from '../../models/data.models';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './post-card.html',
    styleUrl: './post-card.css'
})
export class PostCardComponent {
    @Input() post!: Post;

    currentUser: any = null;
    isExpanded: boolean = false;
    currentSlide = 0;

    constructor(
        protected modalService: ModalService,
        private dataService: DataService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) {
        this.dataService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.cdr.detectChanges();
        });
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
    }

    get hasMedia(): boolean {
        return this.mediaItems.length > 0;
    }

    get mediaItems(): { url: SafeUrl, isVideo: boolean }[] {
        const items: { content: string, isVideo: boolean }[] = [];

        // Add images from list
        if (this.post.images && Array.isArray(this.post.images) && this.post.images.length > 0) {
            items.push(...this.post.images.map(img => ({ content: img, isVideo: this.checkIsVideo(img) })));
        }

        // Fallback for single image
        if (items.length === 0 && this.post.image) {
            items.push({ content: this.post.image, isVideo: this.checkIsVideo(this.post.image) });
        }

        // Add video if present
        if (this.post.video?.url) {
            items.push({ content: this.post.video.url, isVideo: true });
        }

        return items.map(item => ({
            url: this.sanitizer.bypassSecurityTrustUrl(item.content),
            isVideo: item.isVideo
        }));
    }

    checkIsVideo(url: string): boolean {
        if (!url) return false;
        const u = url.toLowerCase();
        return u.startsWith('data:video') || u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.mov');
    }

    nextSlide(event: Event) {
        event.stopPropagation();
        if (this.currentSlide < this.mediaItems.length - 1) {
            this.currentSlide++;
            this.scrollToSlide();
        }
    }

    prevSlide(event: Event) {
        event.stopPropagation();
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.scrollToSlide();
        }
    }

    scrollToSlide() {
        // Element scroll handling would be best done with ViewChild, but for simplicity we rely on data binding + *ngIf or direct DOM if needed.
        // Actually, with simple indexing and *ngIf/transform, or scrollIntoView.
        // For a true scroll snap slider, we assume the user scrolls OR we programmatically scroll. 
        // Let's grab the slider element via ID or class if needed, or simply rely on the user scrolling for now?
        // Wait, I added buttons. I should implement the scroll logic.
        const slider = document.querySelector(`#slider-${this.post.id}`);
        if (slider) {
            const slideWidth = slider.clientWidth;
            slider.scrollTo({ left: this.currentSlide * slideWidth, behavior: 'smooth' });
        }
    }

    // Capture scroll events to update dots
    onScroll(event: Event) {
        const target = event.target as HTMLElement;
        const slideWidth = target.clientWidth;
        this.currentSlide = Math.round(target.scrollLeft / slideWidth);
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    get canEdit(): boolean {
        if (!this.currentUser || !this.post.user) return false;
        return String(this.currentUser.id) === String(this.post.user.id);
    }

    get canDelete(): boolean {
        if (!this.currentUser || !this.post.user) return false;
        const isOwner = String(this.currentUser.id) === String(this.post.user.id);
        const isAdmin = this.currentUser.isAdmin || this.currentUser.role === 'ADMIN';
        return isOwner || isAdmin;
    }

    get canReport(): boolean {
        return this.currentUser && this.post.user && this.currentUser.id !== this.post.user.id;
    }

    toggleLike() {
        if (!this.post || !this.post.id) return;
        this.dataService.toggleLike(this.post.id).subscribe({
            next: (updatedPost) => {
                this.post = updatedPost;
                this.cdr.detectChanges(); // Use injected CDR
            },
            error: (err) => console.error('Error liking post:', err)
        });
    }

    editPost() {
        // Close dropdown by unchecking the checkbox
        const checkbox = document.getElementById(`menu-${this.post.id}`) as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
        this.modalService.open('edit-post', this.post);
    }

    deletePost() {
        const checkbox = document.getElementById(`menu-${this.post.id}`) as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
        this.modalService.open('delete-v2', this.post);
    }

    reportPost() {
        const checkbox = document.getElementById(`menu-${this.post.id}`) as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
        const reportData = { ...this.post, reportType: 'post' };
        this.modalService.open('report-post', reportData);
    }
    openMediaViewer(index: number) {
        this.modalService.open('media-viewer', {
            items: this.mediaItems,
            initialIndex: index
        });
    }
}
