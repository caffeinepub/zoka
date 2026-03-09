# Zoka

## Current State
Zoka is a worldwide short-form video social app (TikTok-style) with:
- Mock data-driven feed (videos, creators, trending content)
- Virtual coins & gifting system
- Skill marketplace
- Savings circles
- Creator revenue dashboard
- Leaderboard
- Navigation: Home, Explore, Upload (stub), Notifications, Profile

Authorization and blob-storage Caffeine components are already installed in the backend.
The backend currently only exposes `getCallerUserRole`, `assignCallerUserRole`, `isCallerAdmin` from the authorization mixin.
No real authentication or user profile management exists yet -- everything runs on mock data.

## Requested Changes (Diff)

### Add
- **Sign Up flow**: Users can register with a display name, username, email, and password. On first login via Internet Identity, prompt them to complete their profile (display name, username, role selection: user or creator).
- **Log In flow**: Users authenticate via Internet Identity (the platform's auth mechanism). After login, the app loads their profile.
- **User profile storage in backend**: Store user profiles (displayName, username, email, role, bio, country, avatarUrl, coinsBalance, followersCount, followingCount, createdAt).
- **Three roles**: `user`, `creator`, `admin`. Users choose between `user` and `creator` on sign-up; admin is assigned by existing admins.
- **Post creation for all logged-in users**: Any authenticated user (regardless of role) can post videos and photos. Posts have: id, creatorPrincipal, mediaUrl, mediaType (video/image), caption, likesCount, commentsCount, createdAt.
- **Post listing**: Retrieve all posts for the feed; retrieve posts by creator.
- **Like a post**: Toggle like on a post (stored per-user).
- **Auth-gated UI**: Unauthenticated visitors see a landing/login screen instead of the full app.

### Modify
- App.tsx: wrap in auth gate -- show login screen if not authenticated, else show full app.
- UploadPage: replace stub with real upload form (caption input, media file picker for video/image, submit to backend).
- ProfilePage: show real logged-in user data from backend instead of mock `currentUser`.
- HomePage feed: supplement mock data with real posts from backend when available.

### Remove
- Nothing removed, mock data stays as fallback for social feed content.

## Implementation Plan
1. Backend: Add `UserProfile` type and stable storage. Implement `registerUser(displayName, username, role)`, `getMyProfile()`, `updateMyProfile(...)`, `createPost(caption, mediaUrl, mediaType)`, `getPosts(limit, offset)`, `getPostsByCreator(principal)`, `likePost(postId)`, `getPost(postId)`.
2. Frontend: Auth gate wrapping entire app. Login screen with Internet Identity button and a sign-up form shown on first login (collect display name, username, role).
3. Frontend: Wire UploadPage to real `createPost` backend call using blob-storage for media.
4. Frontend: Wire ProfilePage to `getMyProfile` for the logged-in user's real data.
5. Frontend: Wire HomePage to fetch real posts alongside mock data.
