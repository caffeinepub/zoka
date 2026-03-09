import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Coins,
  Edit3,
  MapPin,
  Plus,
  Target,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreatorDashboard } from "../components/CreatorDashboard";
import {
  currentUser,
  formatNumber,
  getCreatorById,
  savingsCircles,
  skillListings,
  videos,
} from "../data/mockData";

interface ProfilePageProps {
  userCoins: number;
  onCoinsChange: (delta: number) => void;
}

export function ProfilePage({ userCoins, onCoinsChange }: ProfilePageProps) {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createCircleOpen, setCreateCircleOpen] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [circleTarget, setCircleTarget] = useState("");
  const [circles, setCircles] = useState(savingsCircles);
  const [bio, setBio] = useState(currentUser.bio);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [contributeOpen, setContributeOpen] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");

  const myVideos = videos.filter((v) => v.creatorId === "1").slice(0, 6);
  const mySkills = skillListings.filter((s) => s.creatorId === "1");

  function handleCreateCircle() {
    if (!circleName.trim() || !circleTarget.trim()) return;
    const newCircle = {
      id: `c${Date.now()}`,
      name: circleName,
      description: "A community savings circle",
      targetCoins: Number.parseInt(circleTarget) || 10000,
      currentCoins: 0,
      members: 1,
      maxMembers: 20,
      isJoined: true,
      emoji: "✨",
    };
    setCircles((prev) => [...prev, newCircle]);
    toast.success(`Created "${circleName}" savings circle! 🎉`);
    setCircleName("");
    setCircleTarget("");
    setCreateCircleOpen(false);
  }

  function handleJoinCircle(id: string) {
    setCircles((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isJoined: true, members: c.members + 1 } : c,
      ),
    );
    toast.success("Joined savings circle! 🙌");
  }

  function handleContribute() {
    const amount = Number.parseInt(contributeAmount);
    if (!amount || amount <= 0) return;
    if (userCoins < amount) {
      toast.error("Not enough coins!");
      return;
    }
    setCircles((prev) =>
      prev.map((c) =>
        c.id === contributeOpen
          ? { ...c, currentCoins: c.currentCoins + amount }
          : c,
      ),
    );
    onCoinsChange(-amount);
    toast.success(`Contributed ${amount} coins! 💪`);
    setContributeOpen(null);
    setContributeAmount("");
  }

  function handleSaveProfile() {
    setBio(editBio);
    toast.success("Profile updated! ✓");
    setEditOpen(false);
  }

  return (
    <>
      <div className="pb-6">
        {/* Cover + Avatar */}
        <div className="relative h-36 bg-gradient-to-br from-primary/40 via-accent/20 to-secondary">
          {/* Cover image overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url('/assets/generated/video-fashion.dim_400x500.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />

          {/* Edit cover button */}
          <button
            type="button"
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Avatar overlapping cover */}
        <div className="px-4 -mt-10 relative z-10">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl border-4 border-background overflow-hidden">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              {currentUser.isPro && (
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                  PRO
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="h-8 text-xs border-border hover:border-primary/50 rounded-xl"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                data-ocid="profile.dashboard_button"
                size="sm"
                onClick={() => setDashboardOpen(true)}
                className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Dashboard
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display font-bold text-xl text-foreground">
                {currentUser.displayName}
              </h1>
              {currentUser.isPro && (
                <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] px-2">
                  ⚡ Zoka Pro
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {currentUser.username}
            </p>
            <p className="text-sm text-foreground leading-relaxed mb-2">
              {bio}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {currentUser.flag} {currentUser.country}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Videos", value: myVideos.length, icon: Video },
              {
                label: "Followers",
                value: formatNumber(currentUser.followers),
                icon: Users,
              },
              {
                label: "Following",
                value: formatNumber(currentUser.following),
                icon: Users,
              },
              { label: "Coins", value: formatNumber(userCoins), icon: Coins },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-bold text-foreground text-sm">
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Follow button for visitors */}
          <Button
            data-ocid="profile.follow_button"
            className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold mb-5"
            onClick={() => toast.success("You're following them! ✓")}
          >
            Follow <span className="text-primary-foreground/70 ml-1">+</span>
          </Button>

          {/* Profile Tabs */}
          <Tabs defaultValue="videos">
            <TabsList className="w-full bg-card border border-border rounded-xl p-1 mb-4 grid grid-cols-3">
              <TabsTrigger
                value="videos"
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="circles"
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Circles
              </TabsTrigger>
            </TabsList>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-3 gap-1">
                {myVideos.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-[4/5] rounded-lg overflow-hidden bg-muted cursor-pointer relative group"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[9px] line-clamp-2 leading-tight">
                        {video.title}
                      </p>
                    </div>
                    {video.isTrending && (
                      <div className="absolute top-1 right-1">
                        <span className="text-xs">🔥</span>
                      </div>
                    )}
                  </div>
                ))}
                {/* Upload more */}
                <div className="aspect-[4/5] rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <div className="space-y-3">
                {mySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="zoka-card p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {skill.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {skill.category} · {skill.durationMinutes}min
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary font-bold text-sm">
                        <Coins className="w-3 h-3" />
                        {skill.priceCoins}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {skill.bookedCount} booked
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10 rounded-xl h-10 text-sm"
                  onClick={() => toast("Skill listing creation coming soon! 🛠️")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill Listing
                </Button>
              </div>
            </TabsContent>

            {/* Savings Circles Tab */}
            <TabsContent value="circles">
              <div className="space-y-3">
                {circles.map((circle) => (
                  <div key={circle.id} className="zoka-card p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xl">{circle.emoji}</span>
                          <h4 className="font-bold text-foreground text-sm">
                            {circle.name}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {circle.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Users className="w-3 h-3" />
                        {circle.members}/{circle.maxMembers}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <Coins className="w-3 h-3" />
                          {formatNumber(circle.currentCoins)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="w-3 h-3" />
                          {formatNumber(circle.targetCoins)}
                        </div>
                      </div>
                      <Progress
                        value={(circle.currentCoins / circle.targetCoins) * 100}
                        className="h-2"
                      />
                      <p className="text-[10px] text-muted-foreground text-right">
                        {Math.round(
                          (circle.currentCoins / circle.targetCoins) * 100,
                        )}
                        % of goal reached
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {circle.isJoined ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs border-primary/30 text-primary hover:bg-primary/10 rounded-xl"
                          onClick={() => {
                            setContributeOpen(circle.id);
                            setContributeAmount("");
                          }}
                        >
                          <Coins className="w-3 h-3 mr-1" />
                          Contribute
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                          onClick={() => handleJoinCircle(circle.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Join Circle
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Create Circle Button */}
                <Button
                  data-ocid="circles.create_button"
                  onClick={() => setCreateCircleOpen(true)}
                  variant="outline"
                  className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10 rounded-xl h-10 text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Circle
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Creator Dashboard */}
      <CreatorDashboard
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
      />

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-border bg-popover max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Bio
              </Label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                maxLength={150}
                className="w-full rounded-xl bg-card border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {editBio.length}/150
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Circle Dialog */}
      <Dialog open={createCircleOpen} onOpenChange={setCreateCircleOpen}>
        <DialogContent className="border-border bg-popover max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Create Savings Circle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Circle Name
              </Label>
              <Input
                placeholder="e.g. Studio Equipment Fund"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                className="bg-card border-border focus:border-primary rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Target Amount (coins)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={circleTarget}
                onChange={(e) => setCircleTarget(e.target.value)}
                className="bg-card border-border focus:border-primary rounded-xl h-11"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCreateCircleOpen(false)}
                className="flex-1"
                data-ocid="circles.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCircle}
                disabled={!circleName.trim() || !circleTarget.trim()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="circles.confirm_button"
              >
                Create Circle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog
        open={!!contributeOpen}
        onOpenChange={() => setContributeOpen(null)}
      >
        <DialogContent className="border-border bg-popover max-w-xs mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Contribute Coins
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your balance:</span>
              <div className="flex items-center gap-1 text-primary font-bold">
                <Coins className="w-3.5 h-3.5" />
                {userCoins.toLocaleString()} coins
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Amount (coins)
              </Label>
              <Input
                type="number"
                placeholder="How many coins to contribute?"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                className="bg-card border-border focus:border-primary rounded-xl h-11"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setContributeOpen(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleContribute}
                disabled={
                  !contributeAmount || Number.parseInt(contributeAmount) <= 0
                }
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Contribute
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
