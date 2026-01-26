import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';

export type ReportType = 'post' | 'user';

@Component({
    selector: 'app-report-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './report-modal.html',
    styleUrl: './report-modal.css'
})
export class ReportModal {
    @Input() type: ReportType = 'post';

    selectedReason = 'other';
    details = '';

    constructor(
        protected modalService: ModalService,
        private dataService: DataService
    ) { }

    get title(): string {
        return this.type === 'post' ? 'Report Post' : 'Report User';
    }

    get targetName(): string {
        const data = this.modalService.modalData();
        if (this.type === 'post') {
            return data?.title || 'this post';
        }
        return data?.name || 'this user';
    }

    close() {
        this.modalService.close();
    }

    submitReport() {
        const data = this.modalService.modalData();
        const reason = this.selectedReason + (this.details ? ': ' + this.details : '');

        const reportedUserId = this.type === 'user' ? data.id : data.user?.id;
        const reportedPostId = this.type === 'post' ? data.id : null;

        this.dataService.reportContent(reason, reportedUserId, reportedPostId).subscribe({
            next: () => {
                this.modalService.open('success');
            },
            error: (err) => {
                console.error('Error submitting report:', err);
                alert('Failed to submit report. Please try again.');
            }
        });
    }
}
