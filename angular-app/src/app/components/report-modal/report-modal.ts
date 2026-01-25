import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

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

    constructor(protected modalService: ModalService) { }

    get title(): string {
        return this.type === 'post' ? 'Report Issue' : 'Report User';
    }

    get reportingLabel(): string {
        return this.type === 'post' ? 'Reporting Post' : 'Reporting';
    }

    get targetName(): string {
        const data = this.modalService.modalData();
        if (this.type === 'post') {
            return data?.title || 'Unknown Post';
        }
        return data?.handle || '@unknown';
    }

    get targetAuthor(): string {
        const data = this.modalService.modalData();
        return data?.user?.handle || data?.handle || '@unknown';
    }

    close() {
        this.modalService.close();
    }

    submitReport() {
        console.log('Report submitted:', {
            type: this.type,
            reason: this.selectedReason,
            details: this.details
        });
        this.modalService.open('success');
    }
}
