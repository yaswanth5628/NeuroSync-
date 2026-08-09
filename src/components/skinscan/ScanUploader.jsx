import { useRef, useState } from "react";
import { Upload, Camera, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanUploader({ onImageSelected, disabled }) {
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelected(file, url);
  };

  const clearPreview = () => {
    setPreview(null);
    onImageSelected(null, null);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-2xl overflow-hidden border border-border/60 bg-secondary/20"
          >
            <img src={preview} alt="Scan preview" className="w-full max-h-72 object-contain" />
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-destructive/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] bg-success/10 backdrop-blur px-3 py-1.5 rounded-full border border-success/20 text-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Preview ready
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className={`flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${
              dragging
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-border/50 hover:border-primary/40 bg-secondary/10 hover:bg-secondary/20"
            }`}
          >
            <motion.div
              animate={{ y: dragging ? -2 : 0 }}
              className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ boxShadow: "0 0 24px hsl(199 89% 48% / 0.1)" }}
            >
              <ImagePlus className="w-7 h-7 text-primary" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {dragging ? "Drop image here" : "Upload a skin image"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Click to browse or drag & drop</p>
            </div>
            <p className="text-[10px] text-muted-foreground/50">JPG · PNG · HEIC — max 10MB</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl h-9 text-xs border-border/60 hover:border-primary/40"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
        >
          <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Image
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl h-9 text-xs border-border/60 hover:border-primary/40"
          onClick={() => cameraRef.current?.click()}
          disabled={disabled}
        >
          <Camera className="w-3.5 h-3.5 mr-1.5" /> Use Camera
        </Button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
    </div>
  );
}