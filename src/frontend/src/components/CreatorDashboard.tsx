import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BarChart3, Coins, Gift, Star, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { currentUser, formatNumber } from "../data/mockData";

interface CreatorDashboardProps {
  open: boolean;
  onClose: () => void;
}

// Weekly earnings mock data (last 7 days)
const WEEKLY_DATA = [
  { day: "Mon", coins: 280 },
  { day: "Tue", coins: 420 },
  { day: "Wed", coins: 190 },
  { day: "Thu", coins: 650 },
  { day: "Fri", coins: 890 },
  { day: "Sat", coins: 1100 },
  { day: "Sun", coins: 720 },
];

const maxCoins = Math.max(...WEEKLY_DATA.map((d) => d.coins));

const STATS = [
  {
    label: "Total Coins Earned",
    value: "84,200",
    icon: Coins,
    color: "text-primary",
  },
  {
    label: "Marketplace Earnings",
    value: "12,400",
    icon: TrendingUp,
    color: "text-accent",
  },
  {
    label: "Gifts Received",
    value: "8,920",
    icon: Gift,
    color: "text-yellow-400",
  },
  {
    label: "Revenue Share %",
    value: "0.04%",
    icon: BarChart3,
    color: "text-purple-400",
  },
];

export function CreatorDashboard({ open, onClose }: CreatorDashboardProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        data-ocid="dashboard.sheet"
        side="bottom"
        className="bg-popover border-t border-border rounded-t-2xl h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="mb-5">
          <SheetTitle className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Creator Dashboard
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Your earnings & performance this week
          </p>
        </SheetHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="zoka-card p-3 space-y-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className={`text-xl font-bold font-display ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Share Banner */}
        <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <p className="font-bold text-foreground text-sm">
              You own a piece of Zoka
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your Revenue Share:{" "}
            <span className="text-primary font-bold">0.04%</span> of Zoka's
            platform earnings. As you grow, your ownership percentage increases.
            Keep creating to earn more.
          </p>
        </div>

        {/* Weekly Earnings Chart */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" />
            Weekly Earnings (coins)
          </h3>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-end gap-2 h-32">
              {WEEKLY_DATA.map((day) => {
                const height = Math.round((day.coins / maxCoins) * 100);
                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full flex flex-col justify-end"
                      style={{ height: "100px" }}
                    >
                      <div
                        className="w-full rounded-t-md transition-all duration-700 relative group"
                        style={{
                          height: `${height}%`,
                          background:
                            "linear-gradient(180deg, oklch(0.72 0.19 55) 0%, oklch(0.58 0.15 55) 100%)",
                          minHeight: "4px",
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.coins}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Total this week</span>
              <div className="flex items-center gap-1 text-primary font-bold">
                <Coins className="w-3 h-3" />
                {formatNumber(WEEKLY_DATA.reduce((s, d) => s + d.coins, 0))}{" "}
                coins
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm mb-0.5">
                Upgrade to Zoka Pro
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Get 2× revenue share, advanced analytics, exclusive filters, and
                a Pro badge.
              </p>
              <Button
                onClick={() => {
                  toast.success("Zoka Pro checkout coming soon! 🚀");
                  onClose();
                }}
                data-ocid="profile.pro_button"
                className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl text-sm"
              >
                Upgrade for 5,000 coins/month
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-sm">
            📈 Performance Tips
          </h3>
          {[
            "Post 3× per week for maximum algorithmic reach",
            "Use 5–8 trending hashtags per video",
            "Engage with comments in the first hour",
            "Live streams earn 3× more gifts than regular videos",
          ].map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <span className="text-accent mt-0.5">▸</span>
              {tip}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
