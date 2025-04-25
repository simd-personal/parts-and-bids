"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import toast from "react-hot-toast";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { optimizeImage } from "@/utils/imageOptimization";
import ImageCropper from "./ImageCropper";

interface ImageUploadProps {
  onUploadComplete: (images: { url: string; key: string; isDefault?: boolean }[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ onUploadComplete, maxFiles = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; key: string; isDefault?: boolean }[]>([]);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      // Optimize image
      const optimizedFile = await optimizeImage(file);

      // Create form data
      const formData = new FormData();
      formData.append("file", optimizedFile);

      // Upload to API with retry logic
      let response = null;
      let attempt = 0;

      while (!response && attempt < MAX_RETRIES) {
        try {
          response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }
        } catch (error) {
          attempt++;
          if (attempt === MAX_RETRIES) {
            throw error;
          }
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }

      if (!response) {
        throw new Error("Upload failed after retries");
      }

      const { url, key } = await response.json();
      // Set as default if it's the first image
      const isDefault = previews.length === 0;
      const updatedPreviews = [...previews, { url, key, isDefault }];
      setPreviews(updatedPreviews);
      onUploadComplete(updatedPreviews);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      setUploadError(errorMessage);
      toast.error(errorMessage);
      
      // Increment retry count and try again if under limit
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        handleUpload(file);
        return;
      }
    } finally {
      setUploading(false);
    }
  };

  const setDefaultImage = (index: number) => {
    const updatedPreviews = previews.map((preview, i) => ({
      ...preview,
      isDefault: i === index
    }));
    setPreviews(updatedPreviews);
    onUploadComplete(updatedPreviews);
    toast.success("Default image updated");
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    if (acceptedFiles.length + previews.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }

    const file = acceptedFiles[0];
    // Check file size (20MB limit)
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 20MB");
      return;
    }

    setUploadError(null);
    setRetryCount(0);
    setFileToCrop(file);
  }, [previews, maxFiles]);

  const handleCropComplete = async (croppedFile: File) => {
    setFileToCrop(null);
    await handleUpload(croppedFile);
  };

  const handleCropCancel = () => {
    setFileToCrop(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const removeImage = async (index: number) => {
    const imageToRemove = previews[index];
    try {
      // Delete from S3
      await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: imageToRemove.key }),
      });

      const updatedPreviews = previews.filter((_, i) => i !== index);
      setPreviews(updatedPreviews);
      onUploadComplete(updatedPreviews);
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="space-y-4">
      {fileToCrop && (
        <ImageCropper
          image={fileToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop the files here"
              : "Drag and drop images here, or click to select files"}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP up to 20MB
          </p>
        </div>
      </div>

      {uploading && (
        <div className="text-center text-sm text-gray-500">
          Uploading image... {retryCount > 0 && `(Attempt ${retryCount + 1}/${MAX_RETRIES})`}
        </div>
      )}

      {uploadError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Upload Error
              </h3>
              <div className="mt-2 text-sm text-red-700">{uploadError}</div>
            </div>
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={preview.url}
                  alt={`Upload ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover"
                  unoptimized={preview.url.startsWith('data:')}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <button
                    type="button"
                    onClick={() => setDefaultImage(index)}
                    className="p-1 text-white hover:text-yellow-400 transition-colors"
                    title={preview.isDefault ? "Default image" : "Set as default"}
                  >
                    {preview.isDefault ? (
                      <StarSolid className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarOutline className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 text-white hover:text-red-400 transition-colors ml-2"
                    title="Remove image"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {preview.isDefault && (
                  <div className="absolute top-2 left-2">
                    <StarSolid className="h-5 w-5 text-yellow-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 