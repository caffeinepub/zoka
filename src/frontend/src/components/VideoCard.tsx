import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Gift,
  Heart,
  MessageCircle,
  Play,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Video, formatNumber, getCreatorById } from "../data/mockData";
import { GiftModal } from "./GiftModal";

interface VideoCardProps {
  video: Video;
  index: number;
  userCoins: number;
  onCoinsChange: (delta: number) => void;
}

export function VideoCard({
  video,
  index,
  userCoins,
  onCoinsChange,
}: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [giftOpen, setGiftOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const creator = getCreatorById(video.creatorId);
  const isFirst3 = index < 3;

  function handleLike() {
    if (liked) {
      setLiked(false);
      setLikes((p) => p - 1);
    } else {
      setLiked(true);
      setLikes((p) => p + 1);
      toast.success("❤️ Liked!");
    }
  }

  function handleShare() {
    toast.success("🔗 Link copied to clipboard!");
  }

  function handleComment() {
    toast("💬 Comments coming soon!", {
      description: "We're building this feature!",
    });
  }

  function handleGiftSent(amount: number) {
    onCoinsChange(-amount);
  }

  if (!creator) return null;

  const ocidSuffix = index + 1;

  return (
    <>
      <article
        data-ocid={`feed.item.${ocidSuffix}`}
        className={`
          zoka-card overflow-hidden transition-all duration-300
          hover:shadow-card-hover hover:border-primary/20
          ${isFirst3 ? "animate-slide-up" : ""}
        `}
        style={
          isFirst3 ? { animationDelay: `${index * 0.1}s`, opacity: 0 } : {}
        }
      >
        {/* Thumbnail */}
        <button
          type="button"
          className="relative aspect-[4/5] bg-muted overflow-hidden cursor-pointer w-full block"
          onClick={() => setViewerOpen(true)}
          aria-label={`Watch: ${video.title}`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Play button — always visible for mobile */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {video.isTrending && (
              <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 flex items-center gap-1">
                🔥 Trending
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {video.category}
            </Badge>
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {video.duration}
          </div>

          {/* Views */}
          <div className="absolute bottom-3 left-3 text-white text-xs flex items-center gap-1">
            <Play className="w-3 h-3 fill-white" />
            {formatNumber(video.views)}
          </div>
        </button>

        {/* Content */}
        <div className="p-4">
          {/* Creator info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-8 h-8 border border-primary/30">
              <AvatarImage src={creator.avatar} alt={creator.displayName} />
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {creator.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {creator.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {creator.username} {creator.flag}
              </p>
            </div>
            {creator.isVerified && (
              <span className="text-primary text-xs">✓</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 leading-snug">
            {video.title}
          </h3>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {video.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-primary font-medium hover:text-primary/80 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

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
              {formatNumber(likes)}
            </button>

            <button
              type="button"
              data-ocid={`feed.comment_button.${ocidSuffix}`}
              onClick={handleComment}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110"
            >
              <MessageCircle className="w-4 h-4" />
              {formatNumber(video.comments)}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Share2 className="w-4 h-4" />
              {formatNumber(video.shares)}
            </button>

            <button
              type="button"
              data-ocid={`feed.gift_button.${ocidSuffix}`}
              onClick={() => setGiftOpen(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-zoka-orange transition-all duration-200 hover:scale-110"
            >
              <Gift className="w-4 h-4" />
              <span className="flex items-center gap-0.5">
                <Coins className="w-3 h-3" />
                {formatNumber(video.gifts)}
              </span>
            </button>
          </div>
        </div>
      </article>

      {/* Full-screen Video Viewer */}
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
            {/* Full-screen image (mock demo content) */}
            <div className="relative flex-1 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />

              {/* "Video Preview" label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Play className="w-9 h-9 text-white fill-white ml-1" />
                </div>
                <span className="text-white/70 text-sm font-medium tracking-wide bg-black/40 px-3 py-1 rounded-full">
                  Video Preview
                </span>
              </div>

              {/* Close button */}
              <button
                type="button"
                data-ocid="feed.close_button"
                onClick={() => setViewerOpen(false)}
                className="absolute top-safe top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white hover:bg-black/70 transition-colors z-10"
                aria-label="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Creator info overlay (top-left) */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Avatar className="w-9 h-9 border-2 border-white/40">
                  <AvatarImage src={creator.avatar} alt={creator.displayName} />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {creator.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">
                    {creator.displayName}
                  </p>
                  <p className="text-white/70 text-xs">
                    {creator.username} {creator.flag}
                  </p>
                </div>
                {creator.isVerified && (
                  <span className="text-primary text-xs bg-primary/20 rounded-full px-1.5 py-0.5">
                    ✓
                  </span>
                )}
              </div>
            </div>

            {/* Bottom info panel */}
            <div className="bg-black/95 border-t border-white/10 px-4 pt-4 pb-8">
              {/* Badges */}
              <div className="flex gap-2 mb-2">
                {video.isTrending && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    🔥 Trending
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
                <span className="text-white/50 text-xs ml-auto self-center">
                  {video.duration}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-white font-bold text-base mb-2 leading-snug">
                {video.title}
              </h2>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {video.hashtags.map((tag) => (
                  <span key={tag} className="text-xs text-primary font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                    liked ? "text-red-400" : "text-white/70 hover:text-red-400"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${liked ? "fill-red-400" : ""}`} />
                  {formatNumber(likes)}
                </button>

                <button
                  type="button"
                  onClick={handleComment}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  {formatNumber(video.comments)}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                  Share
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewerOpen(false);
                    setGiftOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 text-xs text-white/70 hover:text-zoka-orange transition-colors ml-auto"
                >
                  <Gift className="w-6 h-6" />
                  <span className="flex items-center gap-0.5">
                    <Coins className="w-3 h-3" />
                    {formatNumber(video.gifts)}
                  </span>
                </button>

                <div className="flex flex-col items-center gap-1 text-xs text-white/50">
                  <Play className="w-5 h-5 fill-white/50" />
                  {formatNumber(video.views)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GiftModal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        creator={creator}
        userCoins={userCoins}
        onGiftSent={handleGiftSent}
      />
    </>
  );
}
