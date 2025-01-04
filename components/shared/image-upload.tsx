"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  disabled
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    disabled,
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
        transition-colors hover:border-primary
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
        ${disabled ? 'opacity-50 cursor-default' : ''}
      `}
    >
      <input {...getInputProps()} />
      {value ? (
        <img
          src={value}
          alt="Upload preview"
          className="mx-auto max-h-64 object-cover rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <ImagePlus className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop an image here, or click to select"}
          </p>
        </div>
      )}
    </div>
  );
}
