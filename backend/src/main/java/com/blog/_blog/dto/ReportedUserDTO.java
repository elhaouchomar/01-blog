package com.blog._blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportedUserDTO {
    private Integer id;
    private String name;
    private String username;
    private String avatar;
    private long reportCount;
    private String status;
}
