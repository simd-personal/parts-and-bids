export function createCanvas(
  image: HTMLImageElement,
  crop: { width: number; height: number; x: number; y: number; unit?: string }
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Convert percentage to pixels if unit is percentage
  const pixelCrop = {
    x: crop.unit === '%' ? (image.width * crop.x) / 100 : crop.x,
    y: crop.unit === '%' ? (image.height * crop.y) / 100 : crop.y,
    width: crop.unit === '%' ? (image.width * crop.width) / 100 : crop.width,
    height: crop.unit === '%' ? (image.height * crop.height) / 100 : crop.height,
  };

  // Set canvas dimensions to the cropped area
  canvas.width = Math.round(pixelCrop.width * scaleX);
  canvas.height = Math.round(pixelCrop.height * scaleY);

  // Draw the cropped portion of the image
  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas;
}

export async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("No 2d context"));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = calculateAspectRatioFit(
        img.naturalWidth,
        img.naturalHeight,
        maxWidth,
        maxHeight
      );

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with better quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.92 // Increased quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
}

function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio)
  };
} 