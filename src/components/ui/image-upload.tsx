"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X, GripVertical, Upload } from "lucide-react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: (File | string)[];
  onChange: (value: (File | string)[]) => void;
  maxFiles?: number;
  className?: string;
  existingImages?: string[];
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 3,
  className,
  existingImages = [],
  ...props
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Create preview URLs for both Files and string URLs
    const urls = value.map((file) => {
      if (typeof file === "string") return file;
      return URL.createObjectURL(file);
    });
    setPreviews(urls);

    // Cleanup
    return () => {
      urls.forEach((url) => {
        if (!value.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - value.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      onChange([...value, ...filesToAdd]);
    },
    [maxFiles, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: maxFiles - value.length,
    onDrop,
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onChange(items);
  };

  const removeImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800",
          isDragActive && "border-primary bg-primary/10",
          value.length >= maxFiles && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
          <Upload className="h-8 w-8 text-gray-500" />
          <p className="text-sm text-gray-500">
            {isDragActive
              ? "Drop the files here"
              : value.length >= maxFiles
              ? "Maximum number of files reached"
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, JPEG up to 10MB
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
              >
                {previews.map((preview, index) => (
                  <Draggable
                    key={preview}
                    draggableId={preview}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="group relative aspect-square overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={preview}
                          alt={`Upload ${index + 1}`}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
} 