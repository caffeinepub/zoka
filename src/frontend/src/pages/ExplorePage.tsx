import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  challenges,
  creators,
  formatNumber,
  getCreatorById,
  leaderboard,
  skillListings,
  trendingHashtags,
  videos,
} from "../data/mockData";
import { LeaderboardPage } from "./LeaderboardPage";
import { MarketplacePage } from "./MarketplacePage";

export function ExplorePage() {
  const [search, setSearch] = useState("");
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(
    new Set(["2", "8"]),
  );
  const [activeView, setActiveView] = useState<
    "explore" | "marketplace" | "leaderboard"
  >("explore");

  function toggleFollow(id: string) {
    setFollowedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Unfollowed");
      } else {
        next.add(id);
        toast.success("Following! ✓");
      }
      return next;
    });
  }

  if (activeView === "marketplace") {
    return <MarketplacePage onBack={() => setActiveView("explore")} />;
  }
  if (activeView === "leaderboard") {
    return <LeaderboardPage onBack={() => setActiveView("explore")} />;
  }

  const filteredCreators = search
    ? creators.filter(
        (c) =>
          c.displayName.toLowerCase().includes(search.toLowerCase()) ||
          c.username.toLowerCase().includes(search.toLowerCase()),
      )
    : creators;

  return (
    <div className="pb-4 space-y-6">
      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="explore.search_input"
            placeholder="Search creators, videos, hashtags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border focus:border-primary rounded-xl h-11 text-sm"
          />
        </div>
      </div>

      {/* Quick Nav Buttons */}
      <div className="px-4 flex gap-3">
        <Button
          onClick={() => setActiveView("marketplace")}
          variant="outline"
          className="flex-1 h-10 text-sm border-primary/30 hover:border-primary hover:bg-primary/10 rounded-xl"
        >
          <Zap className="w-4 h-4 mr-1.5 text-primary" />
          Skill Market
        </Button>
        <Button
          onClick={() => setActiveView("leaderboard")}
          variant="outline"
          className="flex-1 h-10 text-sm border-accent/30 hover:border-accent hover:bg-accent/10 rounded-xl"
        >
          <Trophy className="w-4 h-4 mr-1.5 text-accent" />
          Leaderboard
        </Button>
      </div>

      {/* Trending Hashtags */}
      <section className="px-4">
        <h2 className="font-display font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <span>🔥</span> Trending Now
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {trendingHashtags.map((item, i) => (
            <button
              type="button"
              key={item.tag}
              data-ocid={`explore.hashtag_button.${i + 1}`}
              onClick={() => toast.success(`Searching ${item.tag}...`)}
              className="relative overflow-hidden rounded-xl p-3 text-left group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, oklch(0.35 0.12 ${55 + i * 28}) , oklch(0.25 0.08 ${55 + i * 28}))`,
                border: `1px solid oklch(0.4 0.1 ${55 + i * 28} / 0.4)`,
              }}
            >
              <div className="font-bold text-white text-sm mb-0.5">
                {item.tag}
              </div>
              <div className="text-xs text-white/70">{item.posts} posts</div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Challenges */}
      <section className="px-4">
        <h2 className="font-display font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <span>⚡</span> Active Challenges
        </h2>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="zoka-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{challenge.emoji}</span>
                    <span className="font-bold text-primary text-sm">
                      {challenge.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-border whitespace-nowrap"
                >
                  {challenge.daysLeft}d left
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-accent font-semibold">
                  🏆 {challenge.prize}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatNumber(challenge.entries)} entries
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Progress
                  value={Math.min((challenge.entries / 100000) * 100, 100)}
                  className="flex-1 h-1.5"
                />
                <Button
                  size="sm"
                  className="h-7 text-xs px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  onClick={() => toast.success(`Joined ${challenge.title}! 🔥`)}
                >
                  Join Now
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sponsored by{" "}
                <span className="text-foreground font-medium">
                  {challenge.brand}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="px-4">
        <h2 className="font-display font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Featured Creators
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="zoka-card flex flex-col items-center p-4 min-w-[140px] max-w-[140px] gap-3 flex-shrink-0"
            >
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-primary/30">
                  <AvatarImage src={creator.avatar} alt={creator.displayName} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {creator.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                {creator.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                    ✓
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-xs truncate max-w-[110px]">
                  {creator.displayName}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {creator.flag} {creator.country}
                </p>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {formatNumber(creator.followers)} followers
                </p>
              </div>
              <Button
                size="sm"
                variant={
                  followedCreators.has(creator.id) ? "outline" : "default"
                }
                onClick={() => toggleFollow(creator.id)}
                className={`h-7 text-xs w-full rounded-full ${
                  followedCreators.has(creator.id)
                    ? "border-primary/30 text-primary"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {followedCreators.has(creator.id) ? "Following ✓" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Videos Grid */}
      <section className="px-4">
        <h2 className="font-display font-bold text-base text-foreground mb-3">
          🎬 Trending Videos
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {videos
            .filter((v) => v.isTrending)
            .map((video) => {
              const creator = getCreatorById(video.creatorId);
              return (
                <div
                  key={video.id}
                  className="relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer group"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                      {video.title}
                    </p>
                    {creator && (
                      <p className="text-white/70 text-[10px] mt-0.5">
                        {creator.flag} {creator.username}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                      🔥
                    </Badge>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
