import { useState, useRef } from "react";
import { Camera, Video, Play, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  maxImages?: number;
  value?: string[];
  onChange?: (mediaList: string[]) => void;
  acceptVideo?: boolean;
}

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith("data:video") || /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);
}

export function ImageUploader({ maxImages = 4, value = [], onChange, acceptVideo = true }: ImageUploaderProps) {
  const [mediaItems, setMediaItems] = useState<string[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize if wider than 1024px
          if (width > 1024) {
            height = Math.round((height * 1024) / width);
            width = 1024;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress aggressive to fit in JSON payload (~0.6 quality)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processVideoFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 50MB Limit check for video payload
      if (file.size > 50 * 1024 * 1024) {
        reject(new Error("El archivo de vídeo supera los 50MB máximo."));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    if (mediaItems.length + files.length > maxImages) {
      toast.error(`Puedes subir un máximo de ${maxImages} fotos o vídeos.`);
      return;
    }

    toast.loading("Procesando archivos multimedia...", { id: "uploading" });

    try {
      const processed: string[] = [];

      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const imgData = await resizeAndCompressImage(file);
          processed.push(imgData);
        } else if (file.type.startsWith("video/")) {
          if (!acceptVideo) {
            toast.error("Sólo se permiten imágenes en esta sección");
            continue;
          }
          const videoData = await processVideoFile(file);
          processed.push(videoData);
        }
      }
      
      const updatedMedia = [...mediaItems, ...processed].slice(0, maxImages);
      setMediaItems(updatedMedia);
      onChange?.(updatedMedia);
      toast.success("Archivos multimedia añadidos", { id: "uploading" });
    } catch (error: any) {
      toast.error(error?.message || "Error al procesar los archivos", { id: "uploading" });
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    const updatedMedia = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updatedMedia);
    onChange?.(updatedMedia);
  };

  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {mediaItems.map((item, i) => {
          const isVid = isVideoUrl(item);
          return (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-black">
              {isVid ? (
                <>
                  <video src={item} className="h-full w-full object-cover opacity-80" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="size-8 text-white fill-white/80" />
                  </div>
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Video className="size-3" /> Vídeo
                  </span>
                </>
              ) : (
                <img src={item} alt={`Preview ${i}`} className="h-full w-full object-cover" />
              )}

              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 z-10"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
        
        {mediaItems.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-2 text-center text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Camera className="size-5 text-muted-foreground/80" />
              {acceptVideo && <Video className="size-5 text-red-500/80" />}
            </div>
            <span>Añadir foto o vídeo ({mediaItems.length}/{maxImages})</span>
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
