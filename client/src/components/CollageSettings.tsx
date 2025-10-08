import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CollageSettingsProps {
  imagesPerCollage: number;
  onImagesPerCollageChange: (value: number) => void;
  totalImages: number;
}

export default function CollageSettings({
  imagesPerCollage,
  onImagesPerCollageChange,
  totalImages,
}: CollageSettingsProps) {
  const maxImagesPerCollage = Math.min(totalImages, 9);

  return (
    <Card>
      <CardHeader className="gap-1 space-y-0 pb-3">
        <CardTitle className="text-lg">Collage Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="images-per-collage">Images per Collage</Label>
            <div
              className="text-3xl font-bold text-primary"
              data-testid="text-images-per-collage"
            >
              {imagesPerCollage}
            </div>
          </div>
          <Slider
            id="images-per-collage"
            min={2}
            max={maxImagesPerCollage}
            step={1}
            value={[imagesPerCollage]}
            onValueChange={([value]) => onImagesPerCollageChange(value)}
            disabled={totalImages < 2}
            data-testid="slider-images-per-collage"
          />
          <p className="text-xs text-muted-foreground">
            {totalImages < 2
              ? "Upload at least 2 images to start"
              : `Choose 2-${maxImagesPerCollage} images per collage`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
