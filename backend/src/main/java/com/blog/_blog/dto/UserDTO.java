package com.blog._blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private String role;
    private String avatar;
    private String cover;
    private String bio;
    private java.time.LocalDateTime createdAt;
    private String username; // For frontend compatibility
    private String name;
    private String handle;
    private Boolean subscribed;
    private Boolean isFollowing;
    private Integer followersCount;
    private Integer followingCount;
}
