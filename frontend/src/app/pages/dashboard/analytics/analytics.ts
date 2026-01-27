import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';

@Component({
    selector: 'app-dashboard-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.html',
    styleUrl: './analytics.css',
})
export class Analytics implements OnInit {
    constructor(public dataService: DataService) { }

    ngOnInit() {
        if (!this.dataService.dashboardStats()) {
            this.dataService.loadDashboardStats();
        }
    }

    getActivityPercentage(count: number): number {
        const stats = this.dataService.dashboardStats();
        if (!stats || !stats.activity || stats.activity.length === 0) return 0;
        const max = Math.max(...stats.activity.map((a: any) => a.count));
        return max > 0 ? (count / max) * 100 : 0;
    }

    formatDate(dateStr: string): string {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        } catch {
            return dateStr;
        }
    }
}
