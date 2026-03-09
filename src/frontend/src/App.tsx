import { Toaster } from "@/components/ui/sonner";
import { Bell, Coins, Home, Search, User, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { currentUser, formatNumber, notifications } from "./data/mockData";
import { ExplorePage } from "./pages/ExplorePage";
import { HomePage } from "./pages/HomePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UploadPage } from "./pages/UploadPage";

type Tab = "home" | "explore" | "upload" | "notifications" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [userCoins, setUserCoins] = useState(currentUser.coins);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleCoinsChange(delta: number) {
    setUserCoins((prev) => Math.max(0, prev + delta));
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass-dark border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-1.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-display font-black text-xl tracking-tight">
              <span className="text-gradient-orange">ZOKA</span>
            </span>
          </button>

          {/* Right: Coins + notification dot */}
          <div className="flex items-center gap-3">
            {/* Coins balance */}
            <button
              type="button"
              onClick={() => toast("Buy more coins coming soon! 🪙")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">
                {formatNumber(userCoins)}
              </span>
            </button>

            {/* Live badge */}
            <button
              type="button"
              onClick={() => toast("Live streaming coming soon! 📡")}
              className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-lg mx-auto w-full pb-20">
        {activeTab === "home" && (
          <HomePage userCoins={userCoins} onCoinsChange={handleCoinsChange} />
        )}
        {activeTab === "explore" && <ExplorePage />}
        {activeTab === "upload" && <UploadPage />}
        {activeTab === "notifications" && <NotificationsPage />}
        {activeTab === "profile" && (
          <ProfilePage
            userCoins={userCoins}
            onCoinsChange={handleCoinsChange}
          />
        )}
      </main>

      {/* ── Bottom Navigation ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-border">
        <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around">
          {/* Home */}
          <NavButton
            ocid="nav.home_link"
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            icon={<Home className="w-5 h-5" />}
            label="Home"
          />

          {/* Explore */}
          <NavButton
            ocid="nav.explore_link"
            active={activeTab === "explore"}
            onClick={() => setActiveTab("explore")}
            icon={<Search className="w-5 h-5" />}
            label="Explore"
          />

          {/* Upload - center prominent button */}
          <button
            type="button"
            data-ocid="nav.upload_button"
            onClick={() => setActiveTab("upload")}
            className={`
              relative flex flex-col items-center justify-center
              w-14 h-14 rounded-2xl transition-all duration-300
              ${
                activeTab === "upload"
                  ? "bg-primary shadow-glow scale-110"
                  : "bg-primary/80 hover:bg-primary hover:scale-105 shadow-glow-sm"
              }
            `}
          >
            <Zap className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
            <span className="text-[9px] font-bold text-primary-foreground mt-0.5">
              POST
            </span>
          </button>

          {/* Notifications */}
          <NavButton
            ocid="nav.notifications_link"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
            icon={
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            }
            label="Alerts"
          />

          {/* Profile */}
          <NavButton
            ocid="nav.profile_link"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={<User className="w-5 h-5" />}
            label="Profile"
          />
        </div>
      </nav>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.19 0.02 270)",
            border: "1px solid oklch(0.25 0.025 270)",
            color: "oklch(0.96 0.005 260)",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}

interface NavButtonProps {
  ocid: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavButton({ ocid, active, onClick, icon, label }: NavButtonProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={`
        flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200
        ${
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
    >
      {icon}
      <span
        className={`text-[10px] font-semibold ${active ? "text-primary" : ""}`}
      >
        {label}
      </span>
    </button>
  );
}
