package com.blog._blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalPosts;
    private long totalReports;
    private long bannedUsers;
    private long pendingReports;
    private List<PlatformActivityDTO> activity;
    private List<ReportedUserDTO> mostReportedUsers;
}
