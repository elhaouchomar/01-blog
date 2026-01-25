import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/data.models';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-post.html',
  styleUrl: './confirm-delete-post.css',
})
export class ConfirmDeletePost {
  @Input() post!: Post;

  constructor(protected modalService: ModalService, private dataService: DataService) { }

  ngOnInit() {
    console.log('ConfirmDeletePost initialized with post:', this.post);
  }

  deletePost() {
    this.dataService.deletePost(this.post.id).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        this.modalService.close();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        alert('Failed to delete post.');
        this.modalService.close();
      }
    });
  }
}


