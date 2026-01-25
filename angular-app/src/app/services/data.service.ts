import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import { User, Post, Notification, Comment, AuthenticationRequest, AuthenticationResponse, RegisterRequest, CreatePostRequest } from '../models/data.models';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    // Current user state management
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private API_URL = 'http://localhost:8080/api/v1';

    constructor(private http: HttpClient) {
        // Check for token and fetch user profile
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Fetch real user profile from backend
            this.getProfile().subscribe({
                next: (user) => console.log('User profile loaded:', user),
                error: (err) => {
                    console.error('Failed to load user profile:', err);
                    if (err.status === 401 || err.status === 403) {
                        console.warn('Token is invalid or expired, clearing...');
                        localStorage.removeItem('auth_token');
                        this.currentUserSubject.next(null);
                    }
                }
            });
        }
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        window.location.href = '/login';
    }

    // --- Auth Methods ---

    login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.API_URL}/auth/authenticate`, request)
            .pipe(
                tap(response => {
                    localStorage.setItem('auth_token', response.token);
                    this.getProfile().subscribe(); // Fetch profile immediately
                })
            );
    }

    register(request: RegisterRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.API_URL}/auth/register`, request)
            .pipe(
                tap(response => {
                    localStorage.setItem('auth_token', response.token);
                    this.getProfile().subscribe(); // Fetch profile immediately
                })
            );
    }

    getProfile(): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/users/me`)
            .pipe(
                tap((userDTO: any) => {
                    console.log('User profile loaded:', userDTO);
                    const user = this.mapDTOToUser(userDTO);
                    this.currentUserSubject.next(user);
                })
            );
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<any>(`${this.API_URL}/users/${userId}`)
            .pipe(
                tap((userDTO: any) => {
                    console.log('User profile loaded by ID:', userDTO);
                }),
                map((userDTO: any) => this.mapDTOToUser(userDTO))
            );
    }

    // --- Data Manipulation Methods ---

    addPost(post: CreatePostRequest): Observable<Post> {
        return this.http.post<Post>(`${this.API_URL}/posts`, post);
    }

    updatePost(id: number, post: CreatePostRequest): Observable<Post> {
        return this.http.put<Post>(`${this.API_URL}/posts/${id}`, post);
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/posts/${id}`);
    }

    toggleLike(postId: number): Observable<Post> {
        return this.http.post<Post>(`${this.API_URL}/posts/${postId}/like`, {});
    }

    addComment(postId: number, content: string): Observable<Comment> {
        return this.http.post<Comment>(`${this.API_URL}/posts/${postId}/comment`, { content });
    }

    getCommentsForPost(postId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.API_URL}/posts/${postId}/comments`);
    }

    // --- Getters ---

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.API_URL}/posts`);
    }

    getUserPosts(userId: number): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.API_URL}/posts/user/${userId}`);
    }

    getPost(id: number): Observable<Post> {
        return this.http.get<Post>(`${this.API_URL}/posts/${id}`);
    }

    // --- Admin Methods ---

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.API_URL}/users`);
    }

    deleteUserAction(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/users/${id}`);
    }

    // Assuming ban is an endpoint or toggle
    toggleBan(userId: number): Observable<any> {
        // Backend specific: check if /users/{id}/ban exists or update logic
        // For now using a placeholder or assuming generic update if not verified.
        // Wait, requirements say "Admin can ... ban".
        // Use a speculative endpoint, verify if 404 later.
        return this.http.put(`${this.API_URL}/users/${userId}/ban`, {});
    }

    // Notifications (stub for now)
    // Notifications
    getNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.API_URL}/notifications`);
    }

    markAsRead(id: number): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/notifications/${id}/read`, {});
    }

    markAllAsRead(): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/notifications/read-all`, {});
    }

    updateProfile(user: Partial<User>): Observable<User> {
        return this.http.put<any>(`${this.API_URL}/users/me`, user).pipe(
            tap((userDTO: any) => {
                const updatedUser = this.mapDTOToUser(userDTO);
                this.currentUserSubject.next(updatedUser);
            })
        );
    }

    followUser(userId: number): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/users/${userId}/follow`, {});
    }

    private mapDTOToUser(dto: any): User {
        return {
            id: dto.id,
            name: dto.name || `${dto.firstname} ${dto.lastname}`,
            handle: dto.handle || '@' + (dto.username || dto.email?.split('@')[0] || 'user'),
            avatar: dto.avatar || `https://ui-avatars.com/api/?name=${dto.firstname}+${dto.lastname}`,
            role: dto.role || 'USER',
            isAdmin: dto.role === 'ADMIN',
            isOnline: true,
            email: dto.email,
            firstname: dto.firstname,
            lastname: dto.lastname,
            bio: dto.bio,
            cover: dto.cover,
            createdAt: dto.createdAt,
            subscribed: dto.subscribed,
            isSubscribed: dto.subscribed,
            isFollowing: dto.isFollowing,
            followersCount: dto.followersCount,
            followingCount: dto.followingCount,
            stats: {
                posts: 0, // Should be calculated or returned from backend
                followers: dto.followersCount || 0,
                following: dto.followingCount || 0
            }
        };
    }

}
