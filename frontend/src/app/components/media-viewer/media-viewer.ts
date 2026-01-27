import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-media-viewer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './media-viewer.html',
    styleUrl: './media-viewer.css'
})
export class MediaViewer {
    @Input() data: { items: { url: string | SafeUrl, isVideo: boolean }[], initialIndex: number } | null = null;

    currentIndex = 0;

    constructor(protected modalService: ModalService) { }

    ngOnInit() {
        if (this.data) {
            this.currentIndex = this.data.initialIndex || 0;
        }
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    ngOnDestroy() {
        document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') this.close();
        if (event.key === 'ArrowRight') this.next();
        if (event.key === 'ArrowLeft') this.prev();
    }

    get currentItem() {
        if (!this.data || !this.data.items) return null;
        return this.data.items[this.currentIndex];
    }

    next(event?: Event) {
        if (event) event.stopPropagation();
        if (this.data && this.currentIndex < this.data.items.length - 1) {
            this.currentIndex++;
        }
    }

    prev(event?: Event) {
        if (event) event.stopPropagation();
        if (this.data && this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    close() {
        this.modalService.close();
    }
}
