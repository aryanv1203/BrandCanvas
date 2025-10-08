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
  const Cell = ({ className = "" }: { className?: string }) => (
    <div className={`bg-primary/20 rounded-sm ${className}`} />
  );

  switch (layout) {
    // 2 images
    case "side-by-side":
      return (
        <div className="grid grid-cols-2 gap-0.5 w-full h-full">
          <Cell /><Cell />
        </div>
      );
    
    case "stacked":
      return (
        <div className="grid grid-rows-2 gap-0.5 w-full h-full">
          <Cell /><Cell />
        </div>
      );
    
    case "diagonal":
      return (
        <div className="relative w-full h-full">
          <Cell className="absolute top-0 left-0 right-1/2 bottom-1/2" />
          <Cell className="absolute bottom-0 right-0 left-1/2 top-1/2" />
        </div>
      );
    
    case "overlap":
      return (
        <div className="relative w-full h-full">
          <Cell className="absolute top-0 left-0 right-3 bottom-3" />
          <Cell className="absolute top-3 right-0 left-3 bottom-0" />
        </div>
      );
    
    case "polaroid":
      return (
        <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
          <div className="bg-white p-0.5 pb-2 rounded-sm"><Cell className="w-full h-full" /></div>
          <div className="bg-white p-0.5 pb-2 rounded-sm"><Cell className="w-full h-full" /></div>
        </div>
      );

    // 3 images
    case "triangle":
      return (
        <div className="relative w-full h-full">
          <Cell className="absolute top-0 left-1/4 right-1/4 h-1/2" />
          <Cell className="absolute bottom-0 left-0 w-[48%] h-[45%]" />
          <Cell className="absolute bottom-0 right-0 w-[48%] h-[45%]" />
        </div>
      );

    case "L-shape":
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
          <Cell className="col-span-2" />
          <Cell /><Cell />
        </div>
      );

    case "horizontal":
      return (
        <div className="grid grid-cols-3 gap-0.5 w-full h-full">
          <Cell /><Cell /><Cell />
        </div>
      );

    case "vertical":
      return (
        <div className="grid grid-rows-3 gap-0.5 w-full h-full">
          <Cell /><Cell /><Cell />
        </div>
      );

    // 4 images
    case "grid-2x2":
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
          <Cell /><Cell /><Cell /><Cell />
        </div>
      );

    case "asymmetric":
      return (
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full">
          <Cell className="col-span-2 row-span-2" />
          <Cell className="row-span-2" />
          <Cell />
          <Cell className="col-span-2" />
        </div>
      );

    case "magazine":
      return (
        <div className="grid grid-cols-2 grid-rows-3 gap-0.5 w-full h-full">
          <Cell className="row-span-2" />
          <Cell /><Cell />
          <Cell className="col-span-2" />
        </div>
      );

    case "creative":
      return (
        <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-full h-full">
          <Cell className="col-span-2 row-span-2" />
          <Cell className="col-span-2" />
          <Cell className="col-span-2" />
          <Cell className="col-span-2 row-span-2" />
        </div>
      );

    case "polaroid-grid":
      return (
        <div className="grid grid-cols-2 gap-1 w-full h-full p-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-0.5 pb-1.5 rounded-sm">
              <Cell className="w-full h-full" />
            </div>
          ))}
        </div>
      );

    // 5+ images
    case "cross":
      return (
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full">
          <div /><Cell /><div />
          <Cell /><Cell /><Cell />
          <div /><Cell /><div />
        </div>
      );

    case "grid-2x3":
      return (
        <div className="grid grid-cols-2 grid-rows-3 gap-0.5 w-full h-full">
          {[...Array(6)].map((_, i) => <Cell key={i} />)}
        </div>
      );

    case "grid-3x2":
      return (
        <div className="grid grid-cols-3 grid-rows-2 gap-0.5 w-full h-full">
          {[...Array(6)].map((_, i) => <Cell key={i} />)}
        </div>
      );

    case "grid-3x3":
      return (
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full">
          {[...Array(9)].map((_, i) => <Cell key={i} />)}
        </div>
      );

    case "grid-2x4":
      return (
        <div className="grid grid-cols-2 grid-rows-4 gap-0.5 w-full h-full">
          {[...Array(8)].map((_, i) => <Cell key={i} />)}
        </div>
      );

    case "grid-4x2":
      return (
        <div className="grid grid-cols-4 grid-rows-2 gap-0.5 w-full h-full">
          {[...Array(8)].map((_, i) => <Cell key={i} />)}
        </div>
      );

    case "hexagon":
    case "honeycomb":
      return (
        <div className="grid grid-cols-3 gap-0.5 w-full h-full">
          <div className="flex justify-center"><Cell className="w-2/3 h-full" /></div>
          <Cell />
          <div className="flex justify-center"><Cell className="w-2/3 h-full" /></div>
          <Cell /><Cell /><Cell />
          <div className="flex justify-center"><Cell className="w-2/3 h-full" /></div>
          <Cell />
          <div className="flex justify-center"><Cell className="w-2/3 h-full" /></div>
        </div>
      );

    case "circle":
      return (
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full p-2">
            {[...Array(Math.min(count, 9))].map((_, i) => <Cell key={i} />)}
          </div>
        </div>
      );

    case "octagon":
    case "mosaic":
      return (
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full">
          {[...Array(Math.min(count, 9))].map((_, i) => <Cell key={i} />)}
        </div>
      );

    // Default grid
    default:
      const cols = Math.ceil(Math.sqrt(count));
      return (
        <div className={`grid grid-cols-${cols} gap-0.5 w-full h-full`} style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`
        }}>
          {[...Array(count)].map((_, i) => <Cell key={i} />)}
        </div>
      );
  }
}
