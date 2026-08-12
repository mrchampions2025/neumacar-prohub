import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function VehicleGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-lg border border-border bg-muted"
        aria-label="Ampliar fotografía"
      >
        <img
          src={images[active]}
          alt={title}
          width={1200}
          height={800}
          className="aspect-[3/2] w-full object-cover"
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver fotografía ${i + 1}`}
              className={`overflow-hidden rounded-md border transition-colors ${
                i === active ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
            >
              <img src={img} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl border-border bg-background p-2">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <img src={images[active]} alt={title} className="w-full rounded-md object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
