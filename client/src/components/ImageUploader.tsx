import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UploadedImage {
  id: string;
  url: string;
  label: string;
  file: File;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (id: string) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesAdd,
  onImageRemove,
  maxImages = 25,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length + images.length <= maxImages) {
      onImagesAdd(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length <= maxImages) {
      onImagesAdd(files);
    }
  };

  return (
    <div className="space-y-4">
      {images.length < maxImages && (
        <Card
          className="border-2 border-dashed hover-elevate active-elevate-2 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          data-testid="dropzone-upload"
        >
          <div className="p-8 flex flex-col items-center justify-center min-h-48">
            <Upload className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-base font-medium mb-1">Drag & Drop or Click to Upload</p>
            <p className="text-sm text-muted-foreground">JPG, PNG (Max {maxImages} images)</p>
            <Badge variant="secondary" className="mt-3">
              {images.length} / {maxImages} uploaded
            </Badge>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInput}
        data-testid="input-file-upload"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <Card className="overflow-hidden aspect-square">
                <img
                  src={image.url}
                  alt={`Image ${image.label}`}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className="absolute top-2 left-2 font-bold text-xs"
                  data-testid={`badge-image-${image.label}`}
                >
                  {image.label}
                </Badge>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-7 w-7 opacity-100 transition-opacity"
                  onClick={() => onImageRemove(image.id)}
                  data-testid={`button-remove-${image.label}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
