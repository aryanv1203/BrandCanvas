import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  onTextOverlayChange?: (overlay: TextOverlay | null) => void;
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
  onTextOverlayChange,
}: CollagePreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
  }, [images, layout, textOverlay]);

  // Set up window-level event listeners for drag handling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !textOverlay || !onTextOverlayChange || !canvasRef.current) return;
      
      // Check if mouse button is still pressed
      if (e.buttons !== 1) {
        setIsDragging(false);
        return;
      }
      
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      
      const newX = Math.max(0, Math.min(100, textOverlay.position.x + deltaXPercent));
      const newY = Math.max(0, Math.min(100, textOverlay.position.y + deltaYPercent));
      
      onTextOverlayChange({
        ...textOverlay,
        position: { x: newX, y: newY }
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, textOverlay, onTextOverlayChange, dragStart]);

  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (!textOverlay || !onTextOverlayChange || !canvasRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const renderLayout = () => {
    const imageCount = images.length;

    // Layout rendering based on name and image count
    switch (layout) {
      // 2 images
      case "side-by-side":
        return (
          <div className="grid grid-cols-2 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "stacked":
        return (
          <div className="grid grid-rows-2 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "diagonal":
        return (
          <div className="relative h-full w-full p-2">
            <div className="absolute top-2 left-2 right-1/2 bottom-1/2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 left-1/2 top-1/2 rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "overlap":
        return (
          <div className="relative h-full w-full p-4">
            <div className="absolute top-4 left-4 right-12 bottom-12 rounded-sm overflow-hidden shadow-lg z-10">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-12 right-4 left-12 bottom-4 rounded-sm overflow-hidden shadow-lg">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "polaroid":
        return (
          <div className="grid grid-cols-2 gap-4 h-full w-full p-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-white p-2 pb-8 rounded-sm shadow-lg">
                <img src={img.url} alt={img.label} className="w-full aspect-square object-cover" />
              </div>
            ))}
          </div>
        );

      // 3 images
      case "triangle":
        return (
          <div className="relative h-full w-full p-2">
            <div className="absolute top-2 left-1/4 right-1/4 h-1/2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 left-2 w-[45%] h-[45%] rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 w-[45%] h-[45%] rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "L-shape":
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full p-2">
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "horizontal":
        return (
          <div className="grid grid-cols-3 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "vertical":
        return (
          <div className="grid grid-rows-3 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      // 4 images
      case "grid-2x2":
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "asymmetric":
        if (imageCount === 4) {
          return (
            <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 5) {
          return (
            <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full p-2">
              <div className="col-span-3 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 7) {
          return (
            <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 9) {
          return (
            <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-3 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[8]?.url} alt={images[8]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        }
        return null;

      case "magazine":
        if (imageCount === 4) {
          return (
            <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 5) {
          return (
            <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 6) {
          return (
            <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-3 rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 7) {
          return (
            <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 8) {
          return (
            <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 9) {
          return (
            <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-3 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-3 rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[8]?.url} alt={images[8]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        }
        return null;

      case "creative":
        if (imageCount === 4) {
          return (
            <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-3 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 6) {
          return (
            <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 7) {
          return (
            <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="row-span-2 rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 8) {
          return (
            <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        } else if (imageCount === 9) {
          return (
            <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full w-full p-2">
              <div className="col-span-2 row-span-3 rounded-sm overflow-hidden">
                <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
                <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-sm overflow-hidden">
                <img src={images[8]?.url} alt={images[8]?.label} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        }
        return null;

      case "polaroid-grid":
        return (
          <div className="grid grid-cols-2 gap-3 h-full w-full p-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-white p-2 pb-6 rounded-sm shadow-md">
                <img src={img.url} alt={img.label} className="w-full aspect-square object-cover" />
              </div>
            ))}
          </div>
        );

      // 5+ images - grids and special layouts
      case "grid-2x3":
        return (
          <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "grid-3x2":
        return (
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "grid-3x3":
        return (
          <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "grid-2x4":
        return (
          <div className="grid grid-cols-2 grid-rows-4 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "grid-4x2":
        return (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full w-full p-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case "cross":
        // 5 images in cross pattern - fills all space
        return (
          <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-2">
            <div className="col-span-3 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 rounded-sm overflow-hidden">
              <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "circle":
        // 5 images - no blank spaces
        return (
          <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full p-2">
            <div className="rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 rounded-sm overflow-hidden">
              <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 rounded-sm overflow-hidden">
              <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "hexagon":
        // 6 images unique hexagon-inspired pattern
        return (
          <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full w-full p-2">
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "honeycomb":
        // 7 images attractive honeycomb pattern
        return (
          <div className="grid grid-cols-6 grid-rows-4 gap-2 h-full w-full p-2">
            <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
              <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-4 rounded-sm overflow-hidden">
              <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "octagon":
        // 8 images unique octagon-inspired pattern
        return (
          <div className="grid grid-cols-5 grid-rows-4 gap-2 h-full w-full p-2">
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 row-span-2 rounded-sm overflow-hidden">
              <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 rounded-sm overflow-hidden">
              <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      case "mosaic":
        // 9 images mosaic - varied sizes
        return (
          <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full p-2">
            <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
              <img src={images[0]?.url} alt={images[0]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="row-span-2 rounded-sm overflow-hidden">
              <img src={images[1]?.url} alt={images[1]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="row-span-2 rounded-sm overflow-hidden">
              <img src={images[2]?.url} alt={images[2]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[3]?.url} alt={images[3]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[4]?.url} alt={images[4]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 rounded-sm overflow-hidden">
              <img src={images[5]?.url} alt={images[5]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[6]?.url} alt={images[6]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-sm overflow-hidden">
              <img src={images[7]?.url} alt={images[7]?.label} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-2 rounded-sm overflow-hidden">
              <img src={images[8]?.url} alt={images[8]?.label} className="w-full h-full object-cover" />
            </div>
          </div>
        );

      // Default grid layout
      default:
        const cols = Math.ceil(Math.sqrt(imageCount));
        const rows = Math.ceil(imageCount / cols);
        return (
          <div className={`grid grid-cols-${cols} gap-2 h-full w-full p-2`} style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
          }}>
            {images.map((img, idx) => (
              <div key={idx} className="relative bg-muted rounded-sm overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden bg-card">
        <div
          ref={canvasRef}
          className="aspect-square relative"
          data-testid="canvas-collage-preview"
        >
          {renderLayout()}

          {textOverlay?.text && (
            <div
              className="absolute"
              style={{
                left: `${textOverlay.position.x}%`,
                top: `${textOverlay.position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: onTextOverlayChange ? 'move' : 'default',
              }}
              onMouseDown={handleTextMouseDown}
              data-testid="text-overlay-preview"
            >
              <div
                style={{
                  fontSize: `${textOverlay.fontSize}px`,
                  color: textOverlay.color,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  userSelect: 'none',
                }}
                className="font-bold whitespace-nowrap"
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
