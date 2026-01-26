package com.blog._blog.controller;

import com.blog._blog.dto.UserDTO;
import com.blog._blog.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final com.blog._blog.service.UserService userService;
    private final com.blog._blog.repository.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<java.util.List<UserDTO>> getAllUsers(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(userService.getAllUsers(email));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(userService.convertToDTO(currentUser, currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id, Authentication authentication) {
        User targetUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String email = authentication != null ? authentication.getName() : null;
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        return ResponseEntity.ok(userService.convertToDTO(targetUser, currentUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateAuthenticatedUser(@RequestBody UserDTO userDTO,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(email, userDTO));
    }

    @PutMapping("/me/subscribe")
    public ResponseEntity<UserDTO> toggleSubscribe(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.toggleSubscribe(email));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> followUser(@PathVariable Integer id, Authentication authentication) {
        String email = authentication.getName();
        userService.followUser(email, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        if (!currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        User userToDelete = userRepository.findById(id).orElse(null);
        if (userToDelete == null) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(userToDelete);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<UserDTO> toggleBan(@PathVariable Integer id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        if (!currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        User userToBan = userRepository.findById(id).orElse(null);
        if (userToBan == null) {
            return ResponseEntity.notFound().build();
        }

        userToBan.setBanned(!userToBan.getBanned());
        User updatedUser = userRepository.save(userToBan);

        return ResponseEntity.ok(userService.convertToDTO(updatedUser, currentUser));
    }
}
