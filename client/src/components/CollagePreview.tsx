import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TextOverlay } from "@shared/schema";

interface CollagePreviewProps {
  images: { url: string; label: string }[];
  layout: string;
  textOverlay: TextOverlay | null;
  collageName: string;
  currentIndex?: number;
  totalCount?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function CollagePreview({
  images,
  layout,
  textOverlay,
  collageName,
  currentIndex = 1,
  totalCount = 1,
  onPrevious,
  onNext,
}: CollagePreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // In a real implementation, this would render the actual collage
    // For now, we'll show a placeholder grid
  }, [images, layout, textOverlay]);

  const gridConfigs: Record<string, string> = {
    "side-by-side": "grid-cols-2",
    "stacked": "grid-rows-2",
    "grid-2x2": "grid-cols-2 grid-rows-2",
    "grid-3x3": "grid-cols-3 grid-rows-3",
    "grid-2x3": "grid-cols-2 grid-rows-3",
    "grid-3x2": "grid-cols-3 grid-rows-2",
    "triangle": "grid-cols-2",
    "L-shape": "grid-cols-2 grid-rows-2",
  };

  const gridClass = gridConfigs[layout] || "grid-cols-2";

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden bg-card">
        <div
          ref={canvasRef}
          className="aspect-square relative"
          data-testid="canvas-collage-preview"
        >
          <div className={`grid ${gridClass} gap-1 h-full w-full p-1`}>
            {images.map((image, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img
                  src={image.url}
                  alt={`Image ${image.label}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {textOverlay?.text && (
            <div
              className={`absolute inset-0 flex items-${
                textOverlay.position.includes("top")
                  ? "start"
                  : textOverlay.position.includes("bottom")
                  ? "end"
                  : "center"
              } justify-${
                textOverlay.position.includes("left")
                  ? "start"
                  : textOverlay.position.includes("right")
                  ? "end"
                  : "center"
              } p-8 pointer-events-none`}
            >
              <div
                style={{
                  fontSize: `${textOverlay.fontSize}px`,
                  color: textOverlay.color,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
                className="font-bold"
                data-testid="text-overlay-preview"
              >
                {textOverlay.text}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={!onPrevious || currentIndex <= 1}
            data-testid="button-prev-collage"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-mono" data-testid="text-collage-name">
            {collageName}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={!onNext || currentIndex >= totalCount}
            data-testid="button-next-collage"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex} of {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}
