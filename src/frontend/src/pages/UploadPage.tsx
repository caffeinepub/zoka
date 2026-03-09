import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  Hash,
  Image,
  Link,
  Loader2,
  Tag,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Dance",
  "Cooking",
  "Travel",
  "Fitness",
  "Music",
  "Comedy",
  "Fashion",
  "Tech",
  "Gaming",
  "Art",
  "Other",
];

export function UploadPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [posting, setPosting] = useState(false);

  function addTag() {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please add a title for your video");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    setPosting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPosting(false);
    toast.success("🎉 Video posted! Your content is live on Zoka.");
    setVideoUrl("");
    setThumbnailUrl("");
    setTitle("");
    setDescription("");
    setCategory("");
    setTags([]);
  }

  return (
    <div className="pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Share Your <span className="text-gradient-orange">Story</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Post your video to millions of Zoka creators worldwide
        </p>
      </div>

      {/* Upload Zone */}
      <div className="mx-4 mb-6">
        <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Upload Video File</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              MP4, MOV up to 500MB
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10 rounded-full"
          >
            Browse Files
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 space-y-5">
        {/* Video URL */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-primary" />
            Video URL (optional)
          </Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="bg-card border-border focus:border-primary rounded-xl h-11"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-primary" />
            Thumbnail URL (optional)
          </Label>
          <Input
            placeholder="https://example.com/thumbnail.jpg"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="bg-card border-border focus:border-primary rounded-xl h-11"
          />
          {thumbnailUrl && (
            <div className="rounded-xl overflow-hidden aspect-video mt-2 border border-border">
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Video Title <span className="text-destructive">*</span>
          </Label>
          <Input
            data-ocid="upload.title_input"
            placeholder="Write a catchy title that grabs attention..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="bg-card border-border focus:border-primary rounded-xl h-11"
          />
          <p className="text-xs text-muted-foreground text-right">
            {title.length}/100
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Description
          </Label>
          <Textarea
            data-ocid="upload.description_input"
            placeholder="Tell your audience what this video is about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="bg-card border-border focus:border-primary rounded-xl resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {description.length}/500
          </p>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-card border-border focus:border-primary rounded-xl h-11">
              <SelectValue placeholder="Choose a category..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border rounded-xl">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="rounded-lg">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-primary" />
            Hashtags
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Add hashtag, press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="pl-9 bg-card border-border focus:border-primary rounded-xl h-11"
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="h-11 px-3 border-primary/40 text-primary hover:bg-primary/10 rounded-xl"
            >
              <Tag className="w-4 h-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2.5 py-1 text-xs bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  #{tag} ×
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {tags.length}/10 hashtags
          </p>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            data-ocid="upload.submit_button"
            disabled={posting}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-base shadow-glow transition-all duration-300 hover:shadow-glow-sm"
          >
            {posting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting to Zoka...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Post Video
              </span>
            )}
          </Button>
        </div>

        {/* Creator tip */}
        <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-xs text-muted-foreground">
            <span className="text-accent font-semibold">💡 Creator tip:</span>{" "}
            Videos with trending hashtags get 3× more views. Check the Explore
            tab for what&apos;s trending!
          </p>
        </div>
      </form>
    </div>
  );
}
