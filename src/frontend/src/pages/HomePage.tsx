import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { VideoCard } from "../components/VideoCard";
import { creators, videos } from "../data/mockData";

interface HomePageProps {
  userCoins: number;
  onCoinsChange: (delta: number) => void;
}

export function HomePage({ userCoins, onCoinsChange }: HomePageProps) {
  const [activeStory, setActiveStory] = useState<string | null>(null);

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

      {/* Video Feed */}
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
