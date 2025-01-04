"use client";

    import { useCallback, useState } from "react";
    import { useDropzone } from "react-dropzone";
    import { Music } from "lucide-react";
    import { Button } from "@/components/ui/button";

    interface AudioUploaderProps {
      value: File | null;
      onChange: (file: File | null) => void;
      disabled?: boolean;
    }

    export function AudioUploader({
      value,
      onChange,
      disabled
    }: AudioUploaderProps) {
      const [audioPreview, setAudioPreview] = useState<string | null>(null);

      const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          onChange(file);
          setAudioPreview(URL.createObjectURL(file));
        }
      }, [onChange]);

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
          'audio/*': ['.mp3', '.wav', '.m4a']
        },
        disabled,
        maxFiles: 1
      });

      return (
        <div>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors hover:border-primary
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
              ${disabled ? 'opacity-50 cursor-default' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                {isDragActive
                  ? "Drop the audio file here"
                  : "Drag & drop an audio file here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: MP3, WAV, M4A
              </p>
            </div>
          </div>

          {audioPreview && (
            <div className="mt-4">
              <audio controls className="w-full">
                <source src={audioPreview} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange(null);
                  setAudioPreview(null);
                }}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      );
    }
