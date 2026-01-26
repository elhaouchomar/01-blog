package com.blog._blog.repository;

import com.blog._blog.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    long countByStatus(Report.ReportStatus status);

    long countByReportedPostId(Long reportedPostId);

    @Query("SELECT r.reportedUser, COUNT(r) as reportCount FROM Report r WHERE r.reportedUser IS NOT NULL GROUP BY r.reportedUser ORDER BY reportCount DESC")
    List<Object[]> findMostReportedUsers();
}
