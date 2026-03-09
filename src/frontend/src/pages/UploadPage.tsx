import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  CheckCircle2,
  ChevronDown,
  Film,
  Hash,
  Image as ImageIcon,
  Loader2,
  LogIn,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MediaType } from "../backend";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { StorageClient } from "../utils/StorageClient";

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

const ACCEPTED_TYPES = "video/*,image/*";
const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function UploadPage() {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { actor } = useActor();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const isLoggedIn = !!identity;
  const isVideo = selectedFile?.type.startsWith("video/") ?? false;
  const mediaTypeLabel = isVideo ? "Video" : "Image";

  function openFilePicker() {
    if (!isLoggedIn) return;
    fileInputRef.current?.click();
  }

  function handleFileSelect(file: File) {
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File is too large. Maximum size is 500 MB.");
      return;
    }

    // Revoke previous object URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  }

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

    if (!isLoggedIn) {
      toast.error("Please log in to post content.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a video or image to upload.");
      return;
    }

    if (!caption.trim()) {
      toast.error("Please add a caption for your post.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    if (!actor) {
      toast.error("Backend not ready. Please try again.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const config = await loadConfig();
      const agent = await HttpAgent.create({
        identity,
        ...(config.backend_host ? { host: config.backend_host } : {}),
      });

      const storageClient = new StorageClient(
        "user-media",
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const fileBytes = new Uint8Array(await selectedFile.arrayBuffer());
      const { hash } = await storageClient.putFile(fileBytes, (pct) => {
        setProgress(pct);
      });

      const mediaUrl = await storageClient.getDirectURL(hash);
      const mediaType = isVideo ? MediaType.video : MediaType.image;

      const fullCaption =
        tags.length > 0
          ? `${caption.trim()} ${tags.map((t) => `#${t}`).join(" ")}`
          : caption.trim();

      await actor.createPost(fullCaption, mediaUrl, mediaType);

      toast.success("🎉 Post is live on Zoka!");
      clearFile();
      setCaption("");
      setCategory("");
      setTags([]);
      setProgress(0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(`Upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  // Not logged in state
  if (!isLoggedIn && !isInitializing) {
    return (
      <div className="pb-6 max-w-lg mx-auto">
        <div className="px-4 pt-6 pb-4">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Share Your <span className="text-gradient-orange">Story</span>
          </h1>
        </div>
        <div
          data-ocid="upload.error_state"
          className="mx-4 mt-8 flex flex-col items-center gap-5 text-center p-8 rounded-2xl border border-border bg-card"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <LogIn className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-bold text-lg mb-1">
              Log in to post content
            </p>
            <p className="text-muted-foreground text-sm">
              Create an account or log in to share your videos and photos with
              the world.
            </p>
          </div>
          <Button
            data-ocid="upload.primary_button"
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-11 font-bold"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Log In to Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Share Your <span className="text-gradient-orange">Story</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Post your video or photo to millions of Zoka creators worldwide
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
      />

      {/* Upload Zone */}
      <div className="mx-4 mb-6">
        {selectedFile && previewUrl ? (
          /* File selected — show preview */
          <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-card">
            {/* Preview */}
            <div className="relative aspect-[4/5] bg-black">
              {isVideo ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-contain"
                  playsInline
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* File info bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-card border-t border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {isVideo ? (
                  <Film className="w-4 h-4 text-primary" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mediaTypeLabel} · {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                data-ocid="upload.delete_button"
                onClick={clearFile}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* No file — show drop zone */
          <button
            type="button"
            data-ocid="upload.dropzone"
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer
              transition-all duration-300
              ${
                isDragOver
                  ? "border-primary bg-primary/15 scale-[1.01]"
                  : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
              }
            `}
          >
            <div
              className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300
              ${isDragOver ? "bg-primary/30 scale-110" : "bg-primary/20 group-hover:scale-110"}
            `}
            >
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">
                {isDragOver ? "Drop it here!" : "Upload Video or Photo"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                MP4, MOV, WEBM, JPG, PNG, GIF up to 500 MB
              </p>
            </div>
            <span className="inline-flex items-center justify-center px-4 py-1.5 text-sm border border-primary/40 text-primary rounded-full pointer-events-none bg-transparent">
              Browse Files
            </span>
          </button>
        )}
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div data-ocid="upload.loading_state" className="mx-4 mb-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading to Zoka...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 space-y-5">
        {/* Caption */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Caption <span className="text-destructive">*</span>
          </Label>
          <Textarea
            data-ocid="upload.textarea"
            placeholder="Write a caption that grabs attention..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            rows={3}
            className="bg-card border-border focus:border-primary rounded-xl resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {caption.length}/500
          </p>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              data-ocid="upload.select"
              className="bg-card border-border focus:border-primary rounded-xl h-11"
            >
              <SelectValue placeholder="Choose a category..." />
              <ChevronDown className="w-4 h-4 opacity-50 ml-auto" />
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
              <input
                type="text"
                placeholder="Add hashtag, press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full pl-9 pr-3 h-11 rounded-xl bg-card border border-border focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground transition-colors"
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
            disabled={uploading || !selectedFile}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-base shadow-glow transition-all duration-300 hover:shadow-glow-sm disabled:opacity-50"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading... {progress}%
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Post to Zoka
              </span>
            )}
          </Button>
        </div>

        {/* Success hint */}
        {!uploading && selectedFile && (
          <div
            data-ocid="upload.success_state"
            className="p-3 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-semibold">Ready to post:</span>{" "}
              {mediaTypeLabel} selected — add a caption and hit Post!
            </p>
          </div>
        )}

        {/* Creator tip */}
        {!selectedFile && (
          <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-semibold">💡 Creator tip:</span>{" "}
              Videos with trending hashtags get 3× more views. Check the Explore
              tab for what&apos;s trending!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
