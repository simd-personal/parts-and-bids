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
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const handleCropComplete = async () => {
    if (!imageRef || !crop.width || !crop.height) return;

    const croppedImage = await getCroppedImg(imageRef, crop);
    onCropComplete(croppedImage);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<File> => {
    const canvas = await createCanvas(image, { ...crop, unit: crop.unit });
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
        0.92
      );
    });
  };

  const toggleAspectRatio = () => {
    setAspect(aspect ? undefined : 16 / 9);
    // Reset crop when changing aspect ratio
    setCrop({
      unit: "%",
      width: 100,
      height: aspect ? 100 : (100 * 9) / 16,
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Crop Image</h2>
          <button
            onClick={toggleAspectRatio}
            className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-md"
          >
            {aspect ? "Free Crop" : "16:9 Ratio"}
          </button>
        </div>
        <div className="relative max-h-[70vh] overflow-auto bg-gray-100">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspect}
            className="max-w-full"
            minWidth={100}
            minHeight={100}
          >
            <img
              ref={setImageRef}
              src={URL.createObjectURL(image)}
              alt="Crop preview"
              className="max-w-full"
              style={{ maxHeight: "70vh" }}
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
            Crop & Continue
          </button>
        </div>
      </div>
    </div>
  );
} 