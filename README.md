# 01Blog - Social Blogging Platform for Students

01Blog is a full-featured social blogging platform designed for students to document their learning journeys, share discoveries, and progress. Users can create posts with media, follow other students, engage in discussions through comments, and report inappropriate content.

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Maven 3.8+**
- **Node.js 18+**
- **npm 9+**

### Backend Setup (Spring Boot)
1. Navigate to the `backend` directory.
2. The project uses an H2 in-memory database by default (PostgreSQL support available in application.properties).
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The API will be available at `http://localhost:8080`.
5. Static uploads are stored in the root `uploads/` directory.

### Frontend Setup (Angular)
1. Navigate to the `angular-app` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```
4. Open your browser to `http://localhost:4200`.

## 🛠 Technologies Used

### Backend
- **Java Spring Boot** - Core framework
- **Spring Security** & **JWT** - Secure authentication and role-based access
- **Spring Data JPA** - Data persistence
- **H2/PostgreSQL** - Relational database
- **Lombok** - Boilerplate reduction
- **ModelMapper** - Object mapping

### Frontend
- **Angular** - Component-based framework
- **RxJS** - Reactive programming for data streams
- **Signals** - Efficient state management
- **Standard CSS** - Custom premium UI design
- **Material Symbols** - Modern iconography

## 📂 Project Structure

```
01-blog/
├── angular-app/          # Frontend Angular Application
│   ├── src/app/          
│   │   ├── components/   # Reusable UI components
│   │   ├── guards/       # Auth & Admin route guards
│   │   ├── layout/       # Main application layouts
│   │   ├── pages/        # Main page components
│   │   ├── services/     # Data & Modal services
│   └── ...
├── backend/              # Backend Spring Boot Application
│   ├── src/main/java/.../
│   │   ├── config/       # Security & Web configuration
│   │   ├── controller/   # REST Controllers
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities
│   │   ├── repository/   # Data access layers
│   │   └── service/      # Business logic
│   └── ...
└── uploads/              # Local storage for user media
```

## ✨ Key Features
- **User Block Page**: Public profiles for every user.
- **Interactions**: Like and comment on any post with real-time UI updates.
- **Notifications**: Alerts for new followers, likes, comments, and new posts from followed users.
- **Reporting System**: Secure moderation tools for users and admins.
- **Admin Dashboard**: Comprehensive management of users, posts, and reports.
- **Media Support**: Upload images and videos directly to the filesystem.
- **Responsive Design**: Optimized for mobile and desktop views.
