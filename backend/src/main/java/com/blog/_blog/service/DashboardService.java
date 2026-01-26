package com.blog._blog.service;

import com.blog._blog.dto.DashboardStatsDTO;
import com.blog._blog.dto.PlatformActivityDTO;
import com.blog._blog.dto.ReportedUserDTO;
import com.blog._blog.entity.Report;
import com.blog._blog.entity.User;
import com.blog._blog.repository.PostRepository;
import com.blog._blog.repository.ReportRepository;
import com.blog._blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;

    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        List<PlatformActivityDTO> activity = postRepository.findPostActivity(thirtyDaysAgo)
                .stream()
                .map(obj -> PlatformActivityDTO.builder()
                        .date(obj[0].toString())
                        .count(((Number) obj[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        List<ReportedUserDTO> mostReportedUsers = reportRepository.findMostReportedUsers()
                .stream()
                .limit(5)
                .map(obj -> {
                    User user = (User) obj[0];
                    return ReportedUserDTO.builder()
                            .id(user.getId())
                            .name(user.getFirstname() + " " + user.getLastname())
                            .username(user.getEmail().split("@")[0])
                            .avatar(user.getAvatar())
                            .reportCount(((Number) obj[1]).longValue())
                            .status(user.getBanned() ? "Banned" : "Active")
                            .build();
                })
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalPosts(postRepository.count())
                .totalReports(reportRepository.count())
                .bannedUsers(userRepository.countByBanned(true))
                .pendingReports(reportRepository.countByStatus(Report.ReportStatus.PENDING))
                .activity(activity)
                .mostReportedUsers(mostReportedUsers)
                .build();
    }
}
