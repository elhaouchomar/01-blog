package com.blog._blog.service;

import com.blog._blog.dto.UserDTO;
import com.blog._blog.entity.NotificationType;
import com.blog._blog.entity.User;
import com.blog._blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers(String currentUserEmail) {
        User currentUser = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;
        return userRepository.findAll().stream()
                .map(user -> convertToDTO(user, currentUser))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateProfile(String email, UserDTO updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateRequest.getFirstname() != null)
            user.setFirstname(updateRequest.getFirstname());
        if (updateRequest.getLastname() != null)
            user.setLastname(updateRequest.getLastname());
        if (updateRequest.getBio() != null)
            user.setBio(updateRequest.getBio());
        if (updateRequest.getAvatar() != null)
            user.setAvatar(updateRequest.getAvatar());
        if (updateRequest.getCover() != null)
            user.setCover(updateRequest.getCover());
        if (updateRequest.getSubscribed() != null)
            user.setSubscribed(updateRequest.getSubscribed());

        User saved = userRepository.save(user);
        return convertToDTO(saved, saved);
    }

    @Transactional
    public void followUser(String followerEmail, Integer targetUserId) {
        User follower = userRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (follower.getId().equals(target.getId())) {
            throw new RuntimeException("You cannot follow yourself");
        }

        if (follower.getFollowing().contains(target)) {
            follower.getFollowing().remove(target);
        } else {
            follower.getFollowing().add(target);
            notificationService.createNotification(target, follower, NotificationType.FOLLOW,
                    Long.valueOf(follower.getId()));
        }

        userRepository.save(follower);
    }

    public UserDTO convertToDTO(User user, User currentUser) {
        return UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .name(user.getFirstname() + " " + user.getLastname())
                .handle("@" + user.getEmail().split("@")[0])
                .email(user.getEmail())
                .role(user.getRole().name())
                .username(user.getEmail().split("@")[0])
                .avatar(user.getAvatar())
                .cover(user.getCover())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .subscribed(user.getSubscribed())
                .isFollowing(currentUser != null && currentUser.getFollowing().contains(user))
                .followersCount(user.getFollowers().size())
                .followingCount(user.getFollowing().size())
                .build();
    }
}
