import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collageLayouts } from "@shared/schema";

interface LayoutSelectorProps {
  imagesPerCollage: number;
  selectedLayout: string;
  onLayoutSelect: (layout: string) => void;
}

export default function LayoutSelector({
  imagesPerCollage,
  selectedLayout,
  onLayoutSelect,
}: LayoutSelectorProps) {
  const layouts =
    collageLayouts[imagesPerCollage as keyof typeof collageLayouts] || [];

  return (
    <Card>
      <CardHeader className="gap-1 space-y-0 pb-3">
        <CardTitle className="text-lg">Layout Templates</CardTitle>
        <p className="text-sm text-muted-foreground">
          {layouts.length} layouts available for {imagesPerCollage} images
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {layouts.map((layout) => (
            <button
              key={layout}
              onClick={() => onLayoutSelect(layout)}
              className={`group relative aspect-square rounded-md border-2 transition-all hover-elevate active-elevate-2 ${
                selectedLayout === layout
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border"
              }`}
              data-testid={`button-layout-${layout}`}
            >
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <LayoutPreview layout={layout} count={imagesPerCollage} />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm p-1.5 rounded-b-md">
                <p className="text-xs font-medium text-center capitalize truncate">
                  {layout.replace(/-/g, " ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LayoutPreview({ layout, count }: { layout: string; count: number }) {
  // Simple grid representation for preview
  const gridConfigs: Record<string, string> = {
    "grid-2x2": "grid-cols-2 grid-rows-2",
    "grid-3x3": "grid-cols-3 grid-rows-3",
    "grid-2x3": "grid-cols-2 grid-rows-3",
    "grid-3x2": "grid-cols-3 grid-rows-2",
    "grid-2x4": "grid-cols-2 grid-rows-4",
    "grid-4x2": "grid-cols-4 grid-rows-2",
  };

  const gridClass = gridConfigs[layout] || "grid-cols-2 grid-rows-2";

  return (
    <div className={`grid ${gridClass} gap-0.5 w-full h-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-primary/20 rounded-sm" />
      ))}
    </div>
  );
}
