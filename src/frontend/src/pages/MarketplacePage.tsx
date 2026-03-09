import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Clock, Coins, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCreatorById, skillListings } from "../data/mockData";

interface MarketplacePageProps {
  onBack: () => void;
}

const TIME_SLOTS = [
  "Mon 10:00 AM",
  "Mon 2:00 PM",
  "Tue 9:00 AM",
  "Tue 4:00 PM",
  "Wed 11:00 AM",
  "Thu 3:00 PM",
  "Fri 10:00 AM",
  "Fri 5:00 PM",
];

const CATEGORY_COLORS: Record<string, string> = {
  Dance: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Cooking: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Fitness: "text-green-400 bg-green-400/10 border-green-400/30",
  Art: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Tech: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
};

export function MarketplacePage({ onBack }: MarketplacePageProps) {
  const [bookingSkill, setBookingSkill] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const skill = skillListings.find((s) => s.id === bookingSkill);
  const creator = skill ? getCreatorById(skill.creatorId) : null;

  async function handleConfirmBooking() {
    if (!selectedSlot || !skill) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 900));
    setConfirming(false);
    toast.success(
      `✅ Booked! Session with ${creator?.displayName} at ${selectedSlot}`,
    );
    setBookingSkill(null);
    setSelectedSlot(null);
  }

  return (
    <>
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
              Skill Marketplace
            </h1>
            <p className="text-xs text-muted-foreground">
              Book 1-on-1 sessions with top creators
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="px-4 pt-4 space-y-4">
          {skillListings.map((skill, i) => {
            const creator = getCreatorById(skill.creatorId);
            if (!creator) return null;

            return (
              <div key={skill.id} className="zoka-card p-4 space-y-4">
                {/* Creator + Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-primary/30">
                      <AvatarImage
                        src={creator.avatar}
                        alt={creator.displayName}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {creator.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {creator.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {creator.flag} {creator.country}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${CATEGORY_COLORS[skill.category] || "text-muted-foreground"}`}
                  >
                    {skill.category}
                  </Badge>
                </div>

                {/* Skill Info */}
                <div>
                  <h3 className="font-bold text-foreground text-base mb-1">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="font-semibold text-foreground">
                      {skill.rating}
                    </span>
                    <span>({skill.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {skill.durationMinutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {skill.bookedCount.toLocaleString()} booked
                  </div>
                </div>

                {/* Price + Book */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary text-lg">
                      {skill.priceCoins}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      coins / session
                    </span>
                  </div>
                  <Button
                    data-ocid={`marketplace.book_button.${i + 1}`}
                    onClick={() => {
                      setBookingSkill(skill.id);
                      setSelectedSlot(null);
                    }}
                    className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold text-sm"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!bookingSkill} onOpenChange={() => setBookingSkill(null)}>
        <DialogContent className="border-border bg-popover max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Book a Session
            </DialogTitle>
          </DialogHeader>

          {skill && creator && (
            <div className="space-y-4">
              {/* Skill summary */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <Avatar className="w-12 h-12 border border-primary/30">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {creator.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {skill.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    with {creator.displayName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Coins className="w-3 h-3 text-primary" />
                    <span className="text-primary font-bold text-sm">
                      {skill.priceCoins} coins
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  Pick a time slot:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`
                        text-xs py-2 px-3 rounded-lg border transition-all duration-150
                        ${
                          selectedSlot === slot
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setBookingSkill(null)}
                  className="flex-1"
                  data-ocid="marketplace.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!selectedSlot || confirming}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  data-ocid="marketplace.confirm_button"
                >
                  {confirming
                    ? "Booking..."
                    : `Confirm · ${skill.priceCoins} coins`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
