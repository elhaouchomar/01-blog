import { UserSummaryDTO } from './data.models';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
export type ReportStatusFilter = ReportStatus | 'ALL';

export interface ModerationReport {
    id: number;
    reason: string;
    reporter: UserSummaryDTO;
    reportedUser?: UserSummaryDTO | null;
    reportedPostId?: number | null;
    reportedPostTitle?: string | null;
    reportedPostImage?: string | null;
    reportedPostAuthor?: UserSummaryDTO | null;
    status: ReportStatus;
    createdAt: string;
}

export interface PlatformActivity {
    date: string;
    count: number;
}

export interface ReportedUser {
    id: number;
    name: string;
    username: string;
    avatar: string;
    reportCount: number;
    status: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalPosts: number;
    totalReports: number;
    bannedUsers: number;
    pendingReports: number;
    activity: PlatformActivity[];
    mostReportedUsers: ReportedUser[];
}
