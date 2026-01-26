import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard-overview',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './overview.html',
    styleUrl: './overview.css',
})
export class DashboardOverview implements OnInit {
    stats: any = {
        totalUsers: 0,
        totalPosts: 0,
        totalReports: 0,
        bannedUsers: 0,
        pendingReports: 0,
        activity: [],
        mostReportedUsers: []
    };
    isLoading = true;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.isLoading = true;
        this.dataService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading dashboard stats', err);
                this.isLoading = false;
            }
        });
    }

    getActivityPercentage(count: number): number {
        if (!this.stats.activity || this.stats.activity.length === 0) return 0;
        const max = Math.max(...this.stats.activity.map((a: any) => a.count));
        return max > 0 ? (count / max) * 100 : 0;
    }
}
