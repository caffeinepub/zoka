import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Play, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaType, type Post } from "../backend";
import { VideoCard } from "../components/VideoCard";
import { creators, videos } from "../data/mockData";
import { useActor } from "../hooks/useActor";

interface HomePageProps {
  userCoins: number;
  onCoinsChange: (delta: number) => void;
}

// ── Real Post Card ─────────────────────────────────────────────────────────────
interface RealPostCardProps {
  post: Post;
  index: number;
  onLike: (id: string) => void;
}

function RealPostCard({ post, index, onLike }: RealPostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Number(post.likesCount));
  const [viewerOpen, setViewerOpen] = useState(false);
  const isVideo = post.mediaType === MediaType.video;
  const ocidSuffix = `real.${index + 1}`;

  function handleLike() {
    if (liked) return; // optimistic — can't unlike via API yet
    setLiked(true);
    setLikesCount((p) => p + 1);
    onLike(post.id);
    toast.success("❤️ Liked!");
  }

  function handleShare() {
    toast.success("🔗 Link copied to clipboard!");
  }

  function handleComment() {
    toast("💬 Comments coming soon!", {
      description: "We're building this feature!",
    });
  }

  // Shorten the principal for display
  const principalStr = post.creatorPrincipal.toString();
  const shortPrincipal = `${principalStr.slice(0, 6)}...${principalStr.slice(-4)}`;

  return (
    <>
      <article
        data-ocid={`feed.item.${ocidSuffix}`}
        className="zoka-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/20"
      >
        {/* Thumbnail / Preview */}
        <button
          type="button"
          className="relative aspect-[4/5] bg-muted overflow-hidden cursor-pointer w-full block"
          onClick={() => setViewerOpen(true)}
          aria-label="View post"
        >
          {isVideo ? (
            <>
              <video
                src={post.mediaUrl}
                className="w-full h-full object-cover"
                preload="metadata"
                playsInline
                muted
              >
                <track kind="captions" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          )}

          {/* "New" badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              ✨ New
            </span>
          </div>
        </button>

        {/* Content */}
        <div className="p-4">
          {/* Creator info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-8 h-8 border border-primary/30">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {shortPrincipal[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {shortPrincipal}
              </p>
              <p className="text-xs text-muted-foreground">Zoka Creator</p>
            </div>
          </div>

          {/* Caption */}
          <p className="text-sm text-foreground line-clamp-2 mb-3 leading-snug">
            {post.caption || "No caption"}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              type="button"
              data-ocid={`feed.like_button.${ocidSuffix}`}
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition-all duration-200 hover:scale-110 ${
                liked
                  ? "text-red-400"
                  : "text-muted-foreground hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
              {likesCount}
            </button>

            <button
              type="button"
              onClick={handleComment}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110"
            >
              <MessageCircle className="w-4 h-4" />
              {Number(post.commentsCount)}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </article>

      {/* Full-screen viewer for real posts */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            data-ocid="feed.modal"
            className="fixed inset-0 z-[100] flex flex-col bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Media */}
            <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black">
              {isVideo ? (
                <video
                  src={post.mediaUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                  playsInline
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="max-w-full max-h-full object-contain"
                />
              )}

              {/* Close */}
              <button
                type="button"
                data-ocid="feed.close_button"
                onClick={() => setViewerOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white hover:bg-black/70 transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom panel */}
            <div className="bg-black/95 border-t border-white/10 px-4 pt-4 pb-8">
              <p className="text-white/60 text-xs mb-1">{shortPrincipal}</p>
              <p className="text-white font-semibold text-sm mb-4">
                {post.caption || "No caption"}
              </p>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                    liked ? "text-red-400" : "text-white/70 hover:text-red-400"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${liked ? "fill-red-400" : ""}`} />
                  {likesCount}
                </button>
                <button
                  type="button"
                  onClick={handleComment}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  {Number(post.commentsCount)}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── HomePage ───────────────────────────────────────────────────────────────────
export function HomePage({ userCoins, onCoinsChange }: HomePageProps) {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const { actor, isFetching } = useActor();

  // Fetch real posts — non-blocking, doesn't gate mock content
  const { data: realPosts = [] } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPosts(BigInt(20), BigInt(0));
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  function handleLikePost(postId: string) {
    if (!actor) return;
    actor.likePost(postId).catch(() => {
      // silent — already optimistically updated
    });
  }

  return (
    <div className="pb-4">
      {/* Stories Row */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {/* Add Story */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-card hover:border-primary cursor-pointer transition-all duration-200">
              <span className="text-2xl text-primary font-light">+</span>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Your Story
            </span>
          </div>

          {/* Creator Stories */}
          {creators.map((creator, i) => (
            <button
              type="button"
              key={creator.id}
              onClick={() =>
                setActiveStory(creator.id === activeStory ? null : creator.id)
              }
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div
                className={`
                  w-14 h-14 rounded-full p-0.5 transition-all duration-200
                  ${
                    creator.id === activeStory
                      ? "bg-gradient-to-br from-primary to-accent p-[2px]"
                      : "bg-gradient-to-br from-primary/60 to-accent/60 p-[2px] group-hover:from-primary group-hover:to-accent"
                  }
                `}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-card">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={creator.avatar}
                      alt={creator.displayName}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary text-lg">
                      {creator.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap max-w-[56px] truncate">
                {creator.username.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-foreground">
          For You <span className="text-primary">✦</span>
        </h2>
        <button
          type="button"
          className="text-xs text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Following
        </button>
      </div>

      {/* Real posts from backend (shown first) */}
      {realPosts.length > 0 && (
        <div className="px-4 mb-2">
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live from the community
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {realPosts.map((post, i) => (
              <RealPostCard
                key={post.id}
                post={post}
                index={i}
                onLike={handleLikePost}
              />
            ))}
          </div>
          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              Featured creators
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>
      )}

      {/* Mock Video Feed */}
      <div className="px-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            index={i}
            userCoins={userCoins}
            onCoinsChange={onCoinsChange}
          />
        ))}
      </div>
    </div>
  );
}
