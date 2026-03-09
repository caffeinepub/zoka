// ─── Creators ────────────────────────────────────────────────────────────────
export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  country: string;
  flag: string;
  followers: number;
  following: number;
  coins: number;
  bio: string;
  isVerified: boolean;
  isPro: boolean;
}

export const creators: Creator[] = [
  {
    id: "1",
    username: "@jaydancesNYC",
    displayName: "Jay Okafor",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=jay&backgroundColor=orange",
    country: "USA",
    flag: "🇺🇸",
    followers: 2400000,
    following: 312,
    coins: 84200,
    bio: "NYC street dance champion 🏆 | Teaching the world to move",
    isVerified: true,
    isPro: true,
  },
  {
    id: "2",
    username: "@sakurachef",
    displayName: "Sakura Tanaka",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=sakura&backgroundColor=pink",
    country: "Japan",
    flag: "🇯🇵",
    followers: 1800000,
    following: 204,
    coins: 62100,
    bio: "Tokyo chef | Fusion cuisine that blows minds 🍣✨",
    isVerified: true,
    isPro: true,
  },
  {
    id: "3",
    username: "@amara_vibes",
    displayName: "Amara Diallo",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=amara&backgroundColor=teal",
    country: "Nigeria",
    flag: "🇳🇬",
    followers: 3100000,
    following: 180,
    coins: 98400,
    bio: "Lagos fashion designer | African luxury for the world 🌍",
    isVerified: true,
    isPro: true,
  },
  {
    id: "4",
    username: "@lucas_beats",
    displayName: "Lucas Ferreira",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=lucas&backgroundColor=blue",
    country: "Brazil",
    flag: "🇧🇷",
    followers: 920000,
    following: 445,
    coins: 31500,
    bio: "Funk & Afrobeats producer | Rio de Janeiro 🎵",
    isVerified: false,
    isPro: false,
  },
  {
    id: "5",
    username: "@leila.fitness",
    displayName: "Leila Ahmadi",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=leila&backgroundColor=purple",
    country: "Germany",
    flag: "🇩🇪",
    followers: 1500000,
    following: 289,
    coins: 48700,
    bio: "Berlin athlete | HIIT workouts that actually work 💪",
    isVerified: true,
    isPro: true,
  },
  {
    id: "6",
    username: "@raj_tech",
    displayName: "Raj Patel",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=raj&backgroundColor=yellow",
    country: "India",
    flag: "🇮🇳",
    followers: 780000,
    following: 512,
    coins: 22900,
    bio: "Bengaluru dev | Making tech understandable for everyone 💻",
    isVerified: false,
    isPro: false,
  },
  {
    id: "7",
    username: "@sophie_creates",
    displayName: "Sophie Clarke",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=sophie&backgroundColor=green",
    country: "UK",
    flag: "🇬🇧",
    followers: 1200000,
    following: 367,
    coins: 41300,
    bio: "London artist | Digital art & illustration | Open commissions",
    isVerified: true,
    isPro: false,
  },
  {
    id: "8",
    username: "@diego_comedy",
    displayName: "Diego Morales",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=diego&backgroundColor=red",
    country: "Mexico",
    flag: "🇲🇽",
    followers: 2900000,
    following: 156,
    coins: 87600,
    bio: "CDMX comedian | Making the internet laugh one video at a time 😂",
    isVerified: true,
    isPro: true,
  },
  {
    id: "9",
    username: "@minjun_games",
    displayName: "Min-jun Lee",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=minjun&backgroundColor=cyan",
    country: "South Korea",
    flag: "🇰🇷",
    followers: 4200000,
    following: 98,
    coins: 124000,
    bio: "Seoul gamer | Pro esports | Game reviews & tutorials 🎮",
    isVerified: true,
    isPro: true,
  },
  {
    id: "10",
    username: "@ella_outdoors",
    displayName: "Ella Thompson",
    avatar:
      "https://api.dicebear.com/9.x/notionists/svg?seed=ella&backgroundColor=lime",
    country: "Australia",
    flag: "🇦🇺",
    followers: 680000,
    following: 421,
    coins: 19800,
    bio: "Sydney adventurer | Travel & outdoor photography 📸",
    isVerified: false,
    isPro: false,
  },
];

export const currentUser: Creator = {
  id: "me",
  username: "@you_creator",
  displayName: "You Creator",
  avatar:
    "https://api.dicebear.com/9.x/notionists/svg?seed=me&backgroundColor=orange",
  country: "Worldwide",
  flag: "🌍",
  followers: 14200,
  following: 892,
  coins: 3840,
  bio: "Creating for the world 🌍 | Zoka original creator",
  isVerified: false,
  isPro: false,
};

// ─── Videos ───────────────────────────────────────────────────────────────────
export interface Video {
  id: string;
  creatorId: string;
  title: string;
  hashtags: string[];
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  gifts: number;
  views: number;
  duration: string;
  isTrending: boolean;
  category: string;
}

export const videos: Video[] = [
  {
    id: "v1",
    creatorId: "1",
    title: "NYC Subway Freestyle — Watch this insane battle 🔥",
    hashtags: ["#dance", "#nyc", "#freestyle", "#battle"],
    thumbnail: "/assets/generated/video-dance.dim_400x500.jpg",
    likes: 842000,
    comments: 12400,
    shares: 34200,
    gifts: 8920,
    views: 4200000,
    duration: "0:58",
    isTrending: true,
    category: "Dance",
  },
  {
    id: "v2",
    creatorId: "2",
    title: "Miso Ramen in 15 minutes — Tokyo home recipe ✨",
    hashtags: ["#cooking", "#japanese", "#ramen", "#recipe"],
    thumbnail: "/assets/generated/video-cooking.dim_400x500.jpg",
    likes: 521000,
    comments: 8700,
    shares: 22100,
    gifts: 4380,
    views: 2800000,
    duration: "1:02",
    isTrending: true,
    category: "Food",
  },
  {
    id: "v3",
    creatorId: "10",
    title: "Hiking Kokoda Trail — Day 3 in Papua New Guinea 🌿",
    hashtags: ["#travel", "#hiking", "#adventure", "#australia"],
    thumbnail: "/assets/generated/video-travel.dim_400x500.jpg",
    likes: 234000,
    comments: 4200,
    shares: 11800,
    gifts: 2100,
    views: 1400000,
    duration: "0:47",
    isTrending: false,
    category: "Travel",
  },
  {
    id: "v4",
    creatorId: "5",
    title: "20-minute HIIT that burns 600 calories 💪",
    hashtags: ["#fitness", "#hiit", "#workout", "#health"],
    thumbnail: "/assets/generated/video-fitness.dim_400x500.jpg",
    likes: 678000,
    comments: 9800,
    shares: 41200,
    gifts: 6700,
    views: 3600000,
    duration: "1:15",
    isTrending: true,
    category: "Fitness",
  },
  {
    id: "v5",
    creatorId: "4",
    title: "New track just dropped — Afrobeats x Funk fusion 🎵",
    hashtags: ["#music", "#afrobeats", "#funk", "#producer"],
    thumbnail: "/assets/generated/video-music.dim_400x500.jpg",
    likes: 389000,
    comments: 6100,
    shares: 18900,
    gifts: 3200,
    views: 2100000,
    duration: "0:42",
    isTrending: false,
    category: "Music",
  },
  {
    id: "v6",
    creatorId: "8",
    title: "When your abuela asks about your dating life 😂",
    hashtags: ["#comedy", "#relatable", "#funny", "#latinx"],
    thumbnail: "/assets/generated/video-comedy.dim_400x500.jpg",
    likes: 1200000,
    comments: 24000,
    shares: 89000,
    gifts: 14200,
    views: 8900000,
    duration: "0:55",
    isTrending: true,
    category: "Comedy",
  },
  {
    id: "v7",
    creatorId: "3",
    title: "Lagos Fashion Week 2025 — My collection reveal 🌍",
    hashtags: ["#fashion", "#lagos", "#africa", "#designer"],
    thumbnail: "/assets/generated/video-fashion.dim_400x500.jpg",
    likes: 904000,
    comments: 15200,
    shares: 52100,
    gifts: 11400,
    views: 5400000,
    duration: "1:08",
    isTrending: true,
    category: "Fashion",
  },
  {
    id: "v8",
    creatorId: "9",
    title: "I hit Challenger rank in League of Legends — Full stream recap 🎮",
    hashtags: ["#gaming", "#lol", "#esports", "#challenger"],
    thumbnail: "/assets/generated/video-dance.dim_400x500.jpg",
    likes: 712000,
    comments: 18900,
    shares: 32400,
    gifts: 9800,
    views: 4800000,
    duration: "1:22",
    isTrending: false,
    category: "Gaming",
  },
  {
    id: "v9",
    creatorId: "7",
    title: "Speed painting a galaxy portrait in Procreate ✨",
    hashtags: ["#art", "#digital", "#procreate", "#timelapse"],
    thumbnail: "/assets/generated/video-cooking.dim_400x500.jpg",
    likes: 445000,
    comments: 7300,
    shares: 21000,
    gifts: 5100,
    views: 2300000,
    duration: "0:50",
    isTrending: false,
    category: "Art",
  },
  {
    id: "v10",
    creatorId: "6",
    title: "Build an AI chatbot in 10 minutes with Python 💻",
    hashtags: ["#tech", "#ai", "#python", "#coding"],
    thumbnail: "/assets/generated/video-fitness.dim_400x500.jpg",
    likes: 298000,
    comments: 5600,
    shares: 16800,
    gifts: 2900,
    views: 1900000,
    duration: "0:58",
    isTrending: false,
    category: "Tech",
  },
  {
    id: "v11",
    creatorId: "1",
    title: "Teaching K-pop moves to tourists in Times Square 😂",
    hashtags: ["#dance", "#kpop", "#funny", "#nyc"],
    thumbnail: "/assets/generated/video-travel.dim_400x500.jpg",
    likes: 567000,
    comments: 8900,
    shares: 28000,
    gifts: 6400,
    views: 3100000,
    duration: "1:00",
    isTrending: false,
    category: "Dance",
  },
  {
    id: "v12",
    creatorId: "2",
    title: "Secret sushi technique chefs don't want you to know 🍣",
    hashtags: ["#cooking", "#sushi", "#secret", "#chef"],
    thumbnail: "/assets/generated/video-music.dim_400x500.jpg",
    likes: 689000,
    comments: 11200,
    shares: 38500,
    gifts: 7800,
    views: 4100000,
    duration: "0:45",
    isTrending: true,
    category: "Food",
  },
  {
    id: "v13",
    creatorId: "3",
    title: "Why African fashion is dominating global runways 🌍",
    hashtags: ["#fashion", "#africa", "#culture", "#design"],
    thumbnail: "/assets/generated/video-fashion.dim_400x500.jpg",
    likes: 456000,
    comments: 6800,
    shares: 19400,
    gifts: 4500,
    views: 2600000,
    duration: "1:10",
    isTrending: false,
    category: "Fashion",
  },
  {
    id: "v14",
    creatorId: "4",
    title: "Producing a hit in 24 hours — Studio vlog 🎙️",
    hashtags: ["#music", "#producer", "#studio", "#behindscenes"],
    thumbnail: "/assets/generated/video-dance.dim_400x500.jpg",
    likes: 312000,
    comments: 4800,
    shares: 14200,
    gifts: 3100,
    views: 1700000,
    duration: "0:52",
    isTrending: false,
    category: "Music",
  },
  {
    id: "v15",
    creatorId: "5",
    title: "90-day transformation — Before and after training results 🏆",
    hashtags: ["#fitness", "#transformation", "#results", "#motivation"],
    thumbnail: "/assets/generated/video-fitness.dim_400x500.jpg",
    likes: 1100000,
    comments: 21000,
    shares: 76000,
    gifts: 13200,
    views: 7200000,
    duration: "1:05",
    isTrending: true,
    category: "Fitness",
  },
];

// ─── Skill Listings ───────────────────────────────────────────────────────────
export interface SkillListing {
  id: string;
  creatorId: string;
  title: string;
  category: string;
  description: string;
  priceCoins: number;
  durationMinutes: number;
  rating: number;
  reviews: number;
  bookedCount: number;
}

export const skillListings: SkillListing[] = [
  {
    id: "s1",
    creatorId: "1",
    title: "Street Dance Fundamentals",
    category: "Dance",
    description:
      "Learn breaking, popping & locking from an NYC-trained champion. Beginner to advanced.",
    priceCoins: 500,
    durationMinutes: 45,
    rating: 4.9,
    reviews: 234,
    bookedCount: 1847,
  },
  {
    id: "s2",
    creatorId: "2",
    title: "Japanese Home Cooking Masterclass",
    category: "Cooking",
    description:
      "Master ramen, sushi & tempura with authentic Tokyo techniques. Live hands-on sessions.",
    priceCoins: 400,
    durationMinutes: 60,
    rating: 4.8,
    reviews: 189,
    bookedCount: 1234,
  },
  {
    id: "s3",
    creatorId: "5",
    title: "High-Intensity Personal Training",
    category: "Fitness",
    description:
      "Custom HIIT program + nutrition advice. 1-on-1 sessions with a certified Berlin athlete.",
    priceCoins: 600,
    durationMinutes: 30,
    rating: 4.7,
    reviews: 312,
    bookedCount: 2156,
  },
  {
    id: "s4",
    creatorId: "7",
    title: "Digital Art & Procreate Workshop",
    category: "Art",
    description:
      "From sketch to masterpiece using Procreate. Character design, landscapes & portraits.",
    priceCoins: 350,
    durationMinutes: 60,
    rating: 4.9,
    reviews: 156,
    bookedCount: 987,
  },
  {
    id: "s5",
    creatorId: "6",
    title: "AI & Python for Beginners",
    category: "Tech",
    description:
      "Build your first AI project with Python. No experience needed. Bengaluru-style teaching.",
    priceCoins: 450,
    durationMinutes: 90,
    rating: 4.6,
    reviews: 278,
    bookedCount: 1654,
  },
];

// ─── Savings Circles ──────────────────────────────────────────────────────────
export interface SavingsCircle {
  id: string;
  name: string;
  description: string;
  targetCoins: number;
  currentCoins: number;
  members: number;
  maxMembers: number;
  isJoined: boolean;
  emoji: string;
}

export const savingsCircles: SavingsCircle[] = [
  {
    id: "c1",
    name: "Creator Equipment Fund",
    description:
      "Group savings to buy professional camera and lighting equipment",
    targetCoins: 50000,
    currentCoins: 34200,
    members: 24,
    maxMembers: 30,
    isJoined: true,
    emoji: "📸",
  },
  {
    id: "c2",
    name: "Zoka World Tour 2026",
    description:
      "Saving together for a global creator meetup tour across 5 continents",
    targetCoins: 100000,
    currentCoins: 61800,
    members: 48,
    maxMembers: 50,
    isJoined: false,
    emoji: "✈️",
  },
  {
    id: "c3",
    name: "Lagos Studio Build",
    description:
      "Building Africa's first Zoka-funded recording studio in Lagos",
    targetCoins: 80000,
    currentCoins: 18900,
    members: 12,
    maxMembers: 25,
    isJoined: false,
    emoji: "🎙️",
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "gift" | "milestone" | "collab";
  creatorId: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  coins?: number;
}

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "gift",
    creatorId: "9",
    message: "Min-jun Lee sent you 500 coins as a gift!",
    timeAgo: "2m ago",
    isRead: false,
    coins: 500,
  },
  {
    id: "n2",
    type: "follow",
    creatorId: "3",
    message: "Amara Diallo started following you",
    timeAgo: "5m ago",
    isRead: false,
  },
  {
    id: "n3",
    type: "like",
    creatorId: "8",
    message: 'Diego Morales liked your video "My first Zoka dance"',
    timeAgo: "12m ago",
    isRead: false,
  },
  {
    id: "n4",
    type: "comment",
    creatorId: "2",
    message: 'Sakura Tanaka commented: "This is amazing! Can you collab?"',
    timeAgo: "18m ago",
    isRead: false,
  },
  {
    id: "n5",
    type: "milestone",
    creatorId: "me",
    message: "🎉 You reached 14,000 followers! Keep going!",
    timeAgo: "1h ago",
    isRead: false,
  },
  {
    id: "n6",
    type: "gift",
    creatorId: "5",
    message: "Leila Ahmadi sent you 100 coins",
    timeAgo: "2h ago",
    isRead: false,
    coins: 100,
  },
  {
    id: "n7",
    type: "like",
    creatorId: "1",
    message: "Jay Okafor liked your dance video",
    timeAgo: "3h ago",
    isRead: true,
  },
  {
    id: "n8",
    type: "follow",
    creatorId: "6",
    message: "Raj Patel started following you",
    timeAgo: "4h ago",
    isRead: true,
  },
  {
    id: "n9",
    type: "comment",
    creatorId: "10",
    message: 'Ella Thompson commented: "Your content is fire! 🔥"',
    timeAgo: "5h ago",
    isRead: true,
  },
  {
    id: "n10",
    type: "collab",
    creatorId: "4",
    message: "Lucas Ferreira invited you to a Live Collab session",
    timeAgo: "6h ago",
    isRead: true,
  },
  {
    id: "n11",
    type: "like",
    creatorId: "7",
    message: "Sophie Clarke liked 3 of your videos",
    timeAgo: "8h ago",
    isRead: true,
  },
  {
    id: "n12",
    type: "gift",
    creatorId: "3",
    message: "Amara Diallo sent you 50 coins",
    timeAgo: "10h ago",
    isRead: true,
    coins: 50,
  },
  {
    id: "n13",
    type: "follow",
    creatorId: "9",
    message: "Min-jun Lee started following you",
    timeAgo: "12h ago",
    isRead: true,
  },
  {
    id: "n14",
    type: "comment",
    creatorId: "8",
    message: 'Diego Morales commented: "😂😂😂 this is hilarious"',
    timeAgo: "1d ago",
    isRead: true,
  },
  {
    id: "n15",
    type: "milestone",
    creatorId: "me",
    message: "🏆 Your video hit 10,000 views!",
    timeAgo: "1d ago",
    isRead: true,
  },
  {
    id: "n16",
    type: "like",
    creatorId: "2",
    message: "Sakura Tanaka liked your cooking attempt video",
    timeAgo: "2d ago",
    isRead: true,
  },
  {
    id: "n17",
    type: "gift",
    creatorId: "1",
    message: "Jay Okafor sent you 10 coins",
    timeAgo: "2d ago",
    isRead: true,
    coins: 10,
  },
  {
    id: "n18",
    type: "follow",
    creatorId: "5",
    message: "Leila Ahmadi started following you",
    timeAgo: "3d ago",
    isRead: true,
  },
  {
    id: "n19",
    type: "comment",
    creatorId: "7",
    message: 'Sophie Clarke commented: "Love the art style!"',
    timeAgo: "3d ago",
    isRead: true,
  },
  {
    id: "n20",
    type: "collab",
    creatorId: "3",
    message: "Amara Diallo wants to do a fashion collab with you",
    timeAgo: "4d ago",
    isRead: true,
  },
];

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  creatorId: string;
  weeklyCoinEarnings: number;
  isFollowing: boolean;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, creatorId: "9", weeklyCoinEarnings: 24800, isFollowing: false },
  { rank: 2, creatorId: "8", weeklyCoinEarnings: 19400, isFollowing: true },
  { rank: 3, creatorId: "3", weeklyCoinEarnings: 16200, isFollowing: false },
  { rank: 4, creatorId: "1", weeklyCoinEarnings: 13900, isFollowing: true },
  { rank: 5, creatorId: "5", weeklyCoinEarnings: 11200, isFollowing: false },
  { rank: 6, creatorId: "7", weeklyCoinEarnings: 9800, isFollowing: false },
  { rank: 7, creatorId: "2", weeklyCoinEarnings: 8400, isFollowing: true },
  { rank: 8, creatorId: "4", weeklyCoinEarnings: 7100, isFollowing: false },
  { rank: 9, creatorId: "10", weeklyCoinEarnings: 5600, isFollowing: false },
  { rank: 10, creatorId: "6", weeklyCoinEarnings: 4200, isFollowing: false },
];

// ─── Trending Hashtags ────────────────────────────────────────────────────────
export const trendingHashtags = [
  { tag: "#dance", posts: "2.4M", gradient: "from-orange-500 to-pink-500" },
  { tag: "#cooking", posts: "1.8M", gradient: "from-yellow-500 to-orange-500" },
  { tag: "#travel", posts: "3.1M", gradient: "from-cyan-500 to-blue-500" },
  { tag: "#fitness", posts: "2.9M", gradient: "from-green-500 to-cyan-500" },
  { tag: "#music", posts: "4.2M", gradient: "from-purple-500 to-pink-500" },
  { tag: "#comedy", posts: "5.8M", gradient: "from-red-500 to-orange-500" },
  { tag: "#fashion", posts: "2.1M", gradient: "from-pink-500 to-purple-500" },
  { tag: "#tech", posts: "1.4M", gradient: "from-blue-500 to-cyan-500" },
  { tag: "#gaming", posts: "3.8M", gradient: "from-indigo-500 to-purple-500" },
  { tag: "#art", posts: "1.6M", gradient: "from-teal-500 to-green-500" },
];

// ─── Challenges ───────────────────────────────────────────────────────────────
export const challenges = [
  {
    id: "ch1",
    title: "#ZokaRiseChallenge",
    brand: "Nike",
    description: "Show your glow-up — before vs. after your biggest win",
    prize: "50,000 coins + Nike sponsorship",
    entries: 84200,
    daysLeft: 5,
    emoji: "⚡",
    gradient: "from-orange-600 to-red-600",
  },
  {
    id: "ch2",
    title: "#WorldKitchenChallenge",
    brand: "HelloFresh",
    description: "Cook a traditional dish from ANY country in under 30 minutes",
    prize: "30,000 coins + HelloFresh partnership",
    entries: 61800,
    daysLeft: 12,
    emoji: "🌍",
    gradient: "from-green-600 to-cyan-600",
  },
  {
    id: "ch3",
    title: "#TechForGoodChallenge",
    brand: "Google",
    description: "Build a mini tool that solves a real community problem",
    prize: "40,000 coins + Google internship",
    entries: 23400,
    daysLeft: 18,
    emoji: "💡",
    gradient: "from-blue-600 to-purple-600",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export function getCreatorById(id: string): Creator | undefined {
  return [...creators, currentUser].find((c) => c.id === id);
}
