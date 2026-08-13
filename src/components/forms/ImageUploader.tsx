import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  maxImages?: number;
  value?: string[];
  onChange?: (base64Images: string[]) => void;
}

export function ImageUploader({ maxImages = 4, value = [], onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(value);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      toast.error(`Puedes subir un máximo de ${maxImages} fotos.`);
      return;
    }

    toast.loading("Procesando imágenes...", { id: "uploading" });

    try {
      const newImages = await Promise.all(
        files.filter(f => f.type.startsWith('image/')).map(resizeAndCompressImage)
      );
      
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      setImages(updatedImages);
      onChange?.(updatedImages);
      toast.success("Imágenes añadidas", { id: "uploading" });
    } catch (error) {
      toast.error("Error al procesar las imágenes", { id: "uploading" });
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((img, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border">
            <img src={img} alt={`Preview ${i}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-2 text-center text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Camera className="size-6 text-muted-foreground/60" />
            <span>Añadir foto ({images.length}/{maxImages})</span>
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
