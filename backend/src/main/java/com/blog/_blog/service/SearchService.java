package com.blog._blog.service;

import com.blog._blog.dto.PostDTO;
import com.blog._blog.dto.UserDTO;
import com.blog._blog.entity.Post;
import com.blog._blog.entity.User;
import com.blog._blog.repository.PostRepository;
import com.blog._blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Map<String, Object> search(String query, String filter, int limit, String currentUserEmail) {
        Map<String, Object> results = new HashMap<>();

        User currentUser = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;

        switch (filter.toLowerCase()) {
            case "posts":
                List<PostDTO> posts = searchPosts(query, limit, currentUser);
                results.put("posts", posts);
                break;
            case "people":
                List<UserDTO> users = searchUsers(query, limit, currentUser);
                results.put("users", users);
                break;
            case "all":
            default:
                results.put("posts", searchPosts(query, limit, currentUser));
                results.put("users", searchUsers(query, limit, currentUser));
                break;
        }

        return results;
    }

    private List<PostDTO> searchPosts(String query, int limit, User currentUser) {
        List<Post> posts = postRepository.searchByTitleOrCategory(query.toLowerCase());
        return posts.stream()
                .limit(limit)
                .map(post -> postService.convertToDTO(post, currentUser))
                .collect(Collectors.toList());
    }

    private List<UserDTO> searchUsers(String query, int limit, User currentUser) {
        List<User> users = userRepository.searchByNameOrEmail(query.toLowerCase());
        return users.stream()
                .limit(limit)
                .map(user -> userService.convertToDTO(user, currentUser))
                .collect(Collectors.toList());
    }
}