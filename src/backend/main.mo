import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  public type UserRole = { #user; #creator; #admin };
  public type MediaType = { #video; #image };

  public type UserProfile = {
    displayName : Text;
    username : Text;
    bio : Text;
    country : Text;
    avatarUrl : Text;
    role : UserRole;
    coinsBalance : Nat;
    followersCount : Nat;
    followingCount : Nat;
    createdAt : Int;
  };

  public type Post = {
    id : Text;
    creatorPrincipal : Principal;
    mediaUrl : Text;
    mediaType : MediaType;
    caption : Text;
    likesCount : Nat;
    commentsCount : Nat;
    createdAt : Int;
  };

  public type Like = {
    user : Principal;
    postId : Text;
  };

  public type Follow = {
    follower : Principal;
    following : Principal;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Text, Post>();
  var likes = List.empty<Like>();
  var follows = List.empty<Follow>();

  // User Profile Functions

  public shared ({ caller }) func registerUser(displayName : Text, username : Text, role : UserRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register profiles");
    };

    // Prevent users from self-assigning admin role
    let assignedRole = switch (role) {
      case (#admin) {
        Runtime.trap("Unauthorized: Cannot self-assign admin role");
      };
      case (#user) { #user };
      case (#creator) { #creator };
    };

    let newProfile : UserProfile = {
      displayName;
      username;
      bio = "";
      country = "";
      avatarUrl = "";
      role = assignedRole;
      coinsBalance = 0;
      followersCount = 0;
      followingCount = 0;
      createdAt = Time.now();
    };

    userProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func updateMyProfile(displayName : Text, bio : Text, country : Text, avatarUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their profile");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          profile with
          displayName;
          bio;
          country;
          avatarUrl;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Public profiles - anyone can view (including guests)
    userProfiles.get(user);
  };

  // Post Functions

  public shared ({ caller }) func createPost(caption : Text, mediaUrl : Text, mediaType : MediaType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let postId = caller.toText().concat(caption).concat(Time.now().toText());

    let newPost : Post = {
      id = postId;
      creatorPrincipal = caller;
      mediaUrl;
      mediaType;
      caption;
      likesCount = 0;
      commentsCount = 0;
      createdAt = Time.now();
    };

    posts.add(postId, newPost);
  };

  func comparePostsByTime(p1 : Post, p2 : Post) : Order.Order {
    Int.compare(p2.createdAt, p1.createdAt);
  };

  public query ({ caller }) func getPosts(limit : Nat, offset : Nat) : async [Post] {
    // Public feed - anyone can view (including guests)
    let sortedPosts = posts.values().toArray().sort(comparePostsByTime);

    let start = if (offset >= sortedPosts.size()) {
      return [];
    } else { offset };

    let end = if (start + limit > sortedPosts.size()) {
      sortedPosts.size();
    } else { start + limit };

    sortedPosts.sliceToArray(start, end);
  };

  public query ({ caller }) func getPostsByCreator(creator : Principal) : async [Post] {
    // Public creator feed - anyone can view (including guests)
    posts.values().toArray().filter(
      func(post) {
        post.creatorPrincipal == creator;
      }
    );
  };

  public shared ({ caller }) func likePost(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        let likeExists = likes.any(
          func(like) {
            like.user == caller and like.postId == postId
          }
        );

        var newLikesCount : Nat = post.likesCount;
        if (likeExists) {
          likes := likes.filter(func(like) { not (like.user == caller and like.postId == postId) });
          if (newLikesCount > 0) { newLikesCount -= 1 };
        } else {
          likes.add({ user = caller; postId });
          newLikesCount += 1;
        };

        let updatedPost = { post with likesCount = newLikesCount };
        posts.add(postId, updatedPost);
      };
    };
  };

  public query ({ caller }) func getPost(postId : Text) : async ?Post {
    // Public post view - anyone can view (including guests)
    posts.get(postId);
  };

  // Follow Functions

  public shared ({ caller }) func followUser(target : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };

    if (caller == target) {
      Runtime.trap("Cannot follow yourself");
    };

    if (isFollowingHelper(caller, target)) {
      Runtime.trap("Already following");
    };

    follows.add({ follower = caller; following = target });

    switch (userProfiles.get(target)) {
      case (null) {};
      case (?profile) {
        let updatedProfile = { profile with followersCount = profile.followersCount + 1 };
        userProfiles.add(target, updatedProfile);
      };
    };

    switch (userProfiles.get(caller)) {
      case (null) {};
      case (?profile) {
        let updatedProfile = { profile with followingCount = profile.followingCount + 1 };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func unfollowUser(target : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow others");
    };

    if (not isFollowingHelper(caller, target)) {
      Runtime.trap("Not following");
    };

    follows := follows.filter(func(follow) { not (follow.follower == caller and follow.following == target) });

    switch (userProfiles.get(target)) {
      case (null) {};
      case (?profile) {
        let updatedProfile = {
          profile with followersCount = if (profile.followersCount > 0) {
            profile.followersCount - 1;
          } else { 0 };
        };
        userProfiles.add(target, updatedProfile);
      };
    };

    switch (userProfiles.get(caller)) {
      case (null) {};
      case (?profile) {
        let updatedProfile = {
          profile with followingCount = if (profile.followingCount > 0) {
            profile.followingCount - 1;
          } else { 0 };
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func isFollowing(target : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check follow status");
    };
    isFollowingHelper(caller, target);
  };

  // Helper Functions

  func isFollowingHelper(follower : Principal, following : Principal) : Bool {
    follows.any(
      func(follow) {
        follow.follower == follower and follow.following == following
      }
    );
  };

  // Required frontend interface functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };

    // Prevent users from changing their role to admin via this method
    let safeProfile = switch (profile.role) {
      case (#admin) {
        Runtime.trap("Unauthorized: Cannot assign admin role");
      };
      case _ { profile };
    };

    userProfiles.add(caller, safeProfile);
  };
};

