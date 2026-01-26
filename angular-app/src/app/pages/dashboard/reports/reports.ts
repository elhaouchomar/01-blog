import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';

@Component({
    selector: 'app-dashboard-reports',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reports.html',
    styleUrl: './reports.css',
})
export class Reports implements OnInit {
    reports: any[] = [];
    isLoading = true;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.loadReports();
    }

    loadReports() {
        this.isLoading = true;
        this.dataService.getReports().subscribe({
            next: (data) => {
                this.reports = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading reports', err);
                this.isLoading = false;
            }
        });
    }

    updateStatus(report: any, status: string) {
        this.dataService.updateReportStatus(report.id, status).subscribe({
            next: () => {
                report.status = status;
            },
            error: (err) => console.error('Error updating report status', err)
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
        return status.replace(/_/g, ' ');
    }
}
