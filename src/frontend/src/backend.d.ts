import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Post {
    id: string;
    createdAt: bigint;
    mediaUrl: string;
    creatorPrincipal: Principal;
    caption: string;
    mediaType: MediaType;
    commentsCount: bigint;
    likesCount: bigint;
}
export interface UserProfile {
    bio: string;
    country: string;
    username: string;
    displayName: string;
    followersCount: bigint;
    createdAt: bigint;
    role: UserRole;
    coinsBalance: bigint;
    avatarUrl: string;
    followingCount: bigint;
}
export enum MediaType {
    video = "video",
    image = "image"
}
export enum UserRole {
    creator = "creator",
    admin = "admin",
    user = "user"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createPost(caption: string, mediaUrl: string, mediaType: MediaType): Promise<void>;
    followUser(target: Principal): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getMyProfile(): Promise<UserProfile | null>;
    getPost(postId: string): Promise<Post | null>;
    getPosts(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getPostsByCreator(creator: Principal): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(target: Principal): Promise<boolean>;
    likePost(postId: string): Promise<void>;
    registerUser(displayName: string, username: string, role: UserRole): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unfollowUser(target: Principal): Promise<void>;
    updateMyProfile(displayName: string, bio: string, country: string, avatarUrl: string): Promise<void>;
}
