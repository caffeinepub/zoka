import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Coins, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Creator } from "../data/mockData";

interface GiftModalProps {
  open: boolean;
  onClose: () => void;
  creator: Creator;
  userCoins: number;
  onGiftSent: (amount: number) => void;
}

const COIN_OPTIONS = [
  { amount: 10, label: "10", emoji: "✨", description: "Small appreciation" },
  { amount: 50, label: "50", emoji: "⭐", description: "Great content!" },
  { amount: 100, label: "100", emoji: "🔥", description: "You're amazing!" },
  { amount: 500, label: "500", emoji: "💎", description: "Superstar creator!" },
];

export function GiftModal({
  open,
  onClose,
  creator,
  userCoins,
  onGiftSent,
}: GiftModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!selected) return;
    if (userCoins < selected) {
      toast.error("Not enough coins! Top up to send gifts.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    onGiftSent(selected);
    toast.success(`You sent ${selected} coins to ${creator.displayName}! 🎉`);
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-ocid="gift.modal"
        className="border-border bg-popover max-w-sm mx-auto rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            Send a Gift 🎁
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-1 py-2">
          <img
            src={creator.avatar}
            alt={creator.displayName}
            className="w-16 h-16 rounded-full border-2 border-primary"
          />
          <p className="font-semibold text-foreground">{creator.displayName}</p>
          <p className="text-sm text-muted-foreground">{creator.username}</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Coins className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Your balance:</span>
          <span className="font-bold text-primary">
            {userCoins.toLocaleString()} coins
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {COIN_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.amount}
              onClick={() => setSelected(opt.amount)}
              className={`
                relative rounded-xl p-3 border-2 transition-all duration-200 text-left
                ${
                  selected === opt.amount
                    ? "border-primary bg-primary/10 shadow-glow-sm"
                    : "border-border bg-card hover:border-primary/50"
                }
              `}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <div className="font-bold text-foreground flex items-center gap-1">
                <Coins className="w-3 h-3 text-primary" />
                {opt.amount}
              </div>
              <div className="text-xs text-muted-foreground">
                {opt.description}
              </div>
              {selected === opt.amount && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selected || sending}
            data-ocid="gift.confirm_button"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {sending ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">⚡</span> Sending...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {selected ? `Send ${selected} Coins` : "Select Amount"}
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
