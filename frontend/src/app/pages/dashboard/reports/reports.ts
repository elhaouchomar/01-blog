import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { ModalService } from '../../../services/modal.service';
import { usePagination } from '../../../utils/pagination.utils';

@Component({
    selector: 'app-dashboard-reports',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './reports.html',
    styleUrl: './reports.css',
})
export class Reports implements OnInit {
    // Basic computed for reports - can extend with filters later if needed
    filteredReports = computed(() => this.dataService.reports());

    // Use standardized pagination logic
    pagination = usePagination(this.filteredReports);

    isLoading = computed(() => this.dataService.reports().length === 0 && !this.dataService.dashboardStats());

    constructor(public dataService: DataService, private modalService: ModalService) { }

    ngOnInit() {
        if (this.dataService.reports().length === 0) {
            this.dataService.loadReports();
        }
    }

    updateStatus(report: any, status: string) {
        this.dataService.updateReportStatus(report.id, status).subscribe();
    }

    viewPost(postId: number) {
        this.dataService.getPost(postId).subscribe({
            next: (post) => {
                this.modalService.open('post-details', post);
            },
            error: (err) => console.error('Error loading post:', err)
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'UNDER_REVIEW': return 'status-review';
            case 'RESOLVED': return 'status-resolved';
            case 'DISMISSED': return 'status-dismissed';
            default: return '';
        }
    }

    formatStatus(status: string): string {
        return status?.replace(/_/g, ' ') || '';
    }
}
