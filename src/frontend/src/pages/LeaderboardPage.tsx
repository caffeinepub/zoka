import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatNumber, getCreatorById, leaderboard } from "../data/mockData";

interface LeaderboardPageProps {
  onBack: () => void;
}

const RANK_STYLES: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-orange-400",
};

const RANK_EMOJIS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [followed, setFollowed] = useState<Set<string>>(
    new Set(leaderboard.filter((e) => e.isFollowing).map((e) => e.creatorId)),
  );

  function toggleFollow(creatorId: string) {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
        toast("Unfollowed");
      } else {
        next.add(creatorId);
        toast.success("Following! ✓");
      }
      return next;
    });
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 sticky top-0 z-10 glass-dark border-b border-border">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display font-bold text-lg text-foreground">
            Weekly Leaderboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Top creators by coins earned this week
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-end justify-center gap-4 mb-2">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map(
            (entry, podiumIdx) => {
              const creator = getCreatorById(entry.creatorId);
              if (!creator) return null;
              const heights = ["h-20", "h-28", "h-16"];
              const actualRanks = [2, 1, 3];
              const rank = actualRanks[podiumIdx];

              return (
                <div
                  key={entry.creatorId}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`relative ${podiumIdx === 1 ? "mb-2" : ""}`}>
                    <Avatar
                      className={`${podiumIdx === 1 ? "w-16 h-16" : podiumIdx === 0 ? "w-14 h-14" : "w-12 h-12"} border-2 ${podiumIdx === 1 ? "border-yellow-400" : podiumIdx === 0 ? "border-slate-300" : "border-orange-400"}`}
                    >
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {creator.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 text-lg">
                      {RANK_EMOJIS[rank]}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground text-center max-w-[70px] truncate">
                    {creator.displayName}
                  </p>
                  <div
                    className={`flex items-center gap-1 ${heights[podiumIdx]} w-16 rounded-t-xl justify-center pt-2`}
                    style={{
                      background:
                        podiumIdx === 1
                          ? "linear-gradient(180deg, oklch(0.6 0.15 55) 0%, oklch(0.4 0.1 55) 100%)"
                          : podiumIdx === 0
                            ? "linear-gradient(180deg, oklch(0.5 0.05 260) 0%, oklch(0.3 0.03 260) 100%)"
                            : "linear-gradient(180deg, oklch(0.5 0.12 40) 0%, oklch(0.35 0.08 40) 100%)",
                    }}
                  >
                    <span
                      className={`font-bold text-sm ${RANK_STYLES[rank] || "text-foreground"}`}
                    >
                      #{rank}
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="px-4 space-y-2">
        {leaderboard.map((entry, i) => {
          const creator = getCreatorById(entry.creatorId);
          if (!creator) return null;

          return (
            <div
              key={entry.creatorId}
              data-ocid={i === 0 ? "leaderboard.follow_button.1" : undefined}
              className={`zoka-card p-3 flex items-center gap-3 ${
                entry.rank <= 3 ? "border-primary/20" : ""
              }`}
            >
              {/* Rank */}
              <div
                className={`w-8 text-center font-display font-bold text-lg ${RANK_STYLES[entry.rank] || "text-muted-foreground"}`}
              >
                {RANK_EMOJIS[entry.rank] || `#${entry.rank}`}
              </div>

              {/* Avatar */}
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={creator.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {creator.displayName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {creator.displayName}
                  </p>
                  {creator.isVerified && (
                    <span className="text-primary text-xs">✓</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {creator.flag} {creator.country}
                </p>
              </div>

              {/* Coins Badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Coins className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-primary">
                  {formatNumber(entry.weeklyCoinEarnings)}
                </span>
              </div>

              {/* Follow Button */}
              <Button
                size="sm"
                variant={followed.has(entry.creatorId) ? "outline" : "default"}
                onClick={() => toggleFollow(entry.creatorId)}
                className={`h-7 text-xs px-3 rounded-full ${
                  followed.has(entry.creatorId)
                    ? "border-primary/30 text-primary"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {followed.has(entry.creatorId) ? "✓" : "Follow"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-xs text-muted-foreground text-center">
          <Trophy className="w-3 h-3 inline-block text-primary mr-1" />
          Leaderboard resets every Sunday at midnight UTC. Top 3 earn bonus
          coins!
        </p>
      </div>
    </div>
  );
}
