"use client";

import { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { createCanvas } from "@/utils/imageOptimization";

interface ImageCropperProps {
  image: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const handleCropComplete = async () => {
    if (!imageRef || !crop.width || !crop.height) return;

    const croppedImage = await getCroppedImg(imageRef, crop);
    onCropComplete(croppedImage);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<File> => {
    const canvas = await createCanvas(image, crop);
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const croppedFile = new File([blob], image.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(croppedFile);
        },
        "image/jpeg",
        0.8
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
        <h2 className="text-lg font-medium mb-4">Crop Image</h2>
        <div className="relative max-h-[70vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            className="max-w-full"
          >
            <img
              ref={setImageRef}
              src={URL.createObjectURL(image)}
              alt="Crop preview"
              className="max-w-full"
            />
          </ReactCrop>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
} 