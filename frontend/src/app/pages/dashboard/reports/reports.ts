import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ModalService } from '../../../core/services/modal.service';
import { DbPageHeaderComponent } from '../../../components/dashboard/db-page-header';
import { DbFeedbackComponent } from '../../../components/dashboard/db-feedback';
import { DbPaginationComponent } from '../../../components/dashboard/db-pagination';
import { ReportCardComponent } from '../../../components/report-card/report-card';
import { usePagination } from '../../../shared/utils/pagination.utils';
import { MaterialAlertService } from '../../../core/services/material-alert.service';
import { ModerationReport, ReportStatus, ReportStatusFilter } from '../../../shared/models/moderation.models';
import { UserSummaryDTO } from '../../../shared/models/data.models';
import { Observable } from 'rxjs';

type ReportAction = 'resolve' | 'deletePost' | 'deleteUser' | 'banUser' | 'toggleVisibility';
type ReportActionConfig = {
    title: string;
    text: string;
    confirmButtonText: string;
    confirmButtonColor: string;
    exec: () => Observable<unknown>;
};

@Component({
    selector: 'app-dashboard-reports',
    standalone: true,
    imports: [CommonModule, DbPageHeaderComponent, DbFeedbackComponent, DbPaginationComponent, ReportCardComponent],
    templateUrl: './reports.html',
    styleUrl: './reports.css',
})
export class Reports implements OnInit {
    statusFilter = signal<ReportStatusFilter>('PENDING');

    filteredReports = computed(() => {
        const reports = this.dataService.reports();
        const filter = this.statusFilter();

        if (filter === 'ALL') return reports;
        return reports.filter(r => r.status === filter);
    });

    pagination = usePagination(() => this.filteredReports(), 6);
    paginatedReports = computed(() => this.pagination.paginatedData());
    emptyStateMessage = computed(() => {
        const stats = this.dataService.dashboardStats();
        if (!stats) return 'Everything is quiet. Communities are behaving well.';
        if (stats.totalUsers === 0 && stats.totalPosts === 0) return 'No users and no posts yet.';
        if (stats.totalUsers === 0) return 'No users yet.';
        if (stats.totalPosts === 0) return 'No posts yet.';
        return 'Everything is quiet. Communities are behaving well.';
    });

    isLoading = computed(() => this.dataService.reports().length === 0 && !this.dataService.dashboardStats());

    constructor(
        public dataService: DataService,
        private modalService: ModalService,
        private alert: MaterialAlertService
    ) {
        effect(() => {
            const totalPages = this.pagination.totalPages();
            if (this.pagination.currentPage() > totalPages) {
                this.pagination.goToPage(totalPages);
            }
        });
    }

    setStatusFilter(status: ReportStatusFilter) {
        this.statusFilter.set(status);
        this.pagination.goToPage(1);
    }

    ngOnInit() {
        if (this.dataService.reports().length === 0) {
            this.dataService.loadReports();
        }
        if (!this.dataService.dashboardStats()) {
            this.dataService.loadDashboardStats();
        }
    }

    getTargetUser(report: ModerationReport): UserSummaryDTO | null {
        return report.reportedUser ?? report.reportedPostAuthor ?? null;
    }

    updateStatus(report: ModerationReport, status: ReportStatus) {
        if (status === 'RESOLVED' || status === 'DISMISSED') {
            this.alert.fire({
                title: `${status === 'RESOLVED' ? 'Resolve' : 'Dismiss'} Report?`,
                text: `Are you sure you want to mark this report as ${status.toLowerCase()}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonColor: '#6b7280',
                confirmButtonColor: '#0ea5e9'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.performUpdate(report.id, status);
                }
            });
        } else {
            this.performUpdate(report.id, status);
        }
    }

    handleReportAction(event: { report: ModerationReport, action: ReportAction }) {
        const { report, action } = event;
        const targetUser = report.reportedUser ?? report.reportedPostAuthor ?? null;
        const hasPostTarget = report.reportedPostId !== null && report.reportedPostId !== undefined;

        if (action === 'resolve') {
            this.updateStatus(report, 'RESOLVED');
            return;
        }

        if ((action === 'deletePost' || action === 'toggleVisibility') && !hasPostTarget) return;
        if ((action === 'deleteUser' || action === 'banUser') && !targetUser) return;

        const actionConfigs: Record<Exclude<ReportAction, 'resolve'>, ReportActionConfig> = {
            deletePost: {
                title: 'Remove Post?',
                text: 'This will permanently delete the post and resolve the report.',
                confirmButtonText: 'Delete post',
                confirmButtonColor: '#e11d48',
                exec: () => this.dataService.deletePost(report.reportedPostId!)
            },
            deleteUser: {
                title: 'Remove User?',
                text: `This will permanently delete the user account and all their data.`,
                confirmButtonText: 'Delete user',
                confirmButtonColor: '#e11d48',
                exec: () => this.dataService.deleteUserAction(targetUser!.id)
            },
            banUser: {
                title: targetUser!.banned ? 'Unban User?' : 'Ban User?',
                text: targetUser!.banned
                    ? `Allow ${targetUser!.name} to use the platform again?`
                    : `Are you sure you want to ban ${targetUser!.name}?`,
                confirmButtonText: targetUser!.banned ? 'Unban user' : 'Ban user',
                confirmButtonColor: targetUser!.banned ? '#0ea5e9' : '#e11d48',
                exec: () => this.dataService.toggleBan(targetUser!.id)
            },
            toggleVisibility: {
                title: 'Toggle Visibility?',
                text: 'Change whether this post is visible to other users.',
                confirmButtonText: 'Update visibility',
                confirmButtonColor: '#0ea5e9',
                exec: () => this.dataService.togglePostVisibility(report.reportedPostId!)
            }
        };

        const config = actionConfigs[action];
        if (!config) return;

        this.alert.fire({
            title: config.title,
            text: config.text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: config.confirmButtonColor,
            cancelButtonColor: '#6b7280',
            confirmButtonText: config.confirmButtonText
        }).then((result) => {
            if (result.isConfirmed) {
                config.exec().subscribe({
                    next: () => {
                        this.performUpdate(report.id, 'RESOLVED');
                        this.alert.fire('Action Complete', 'The entity was managed and the report resolved.', 'success');
                    },
                    error: (err: { error?: { message?: string } }) =>
                        this.alert.fire('Error', 'Failed to complete action: ' + (err.error?.message || 'Server error'), 'error')
                });
            }
        });
    }

    private performUpdate(id: number, status: ReportStatus) {
        this.dataService.updateReportStatus(id, status).subscribe({
            next: () => {
                this.alert.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Report ${status.toLowerCase()}`,
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true
                });
            }
        });
    }

    handleView(report: ModerationReport) {
        if (report.reportedPostId) {
            this.viewPost(report.reportedPostId);
        } else if (report.reportedUser) {
            window.open(`/profile/${report.reportedUser.id}`, '_blank');
        }
    }

    viewPost(postId: number) {
        this.dataService.getPost(postId).subscribe({
            next: (post) => {
                this.modalService.open('post-details', post);
            },
            error: () => this.alert.fire('Error', 'Unable to load the selected post.', 'error')
        });
    }

}
