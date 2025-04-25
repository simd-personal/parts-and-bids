"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ImageUpload from "@/components/ImageUpload";

interface ImageUpload {
  file: File;
  key: string;
  isDefault: boolean;
  uploadProgress: number;
  url?: string;
}

export default function SellPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newUploads: ImageUpload[] = files.map((file, index) => ({
      file,
      key: `listings/${session?.user?.id}/${Date.now()}-${file.name}`,
      isDefault: index === 0 && imageUploads.length === 0,
      uploadProgress: 0,
      url: URL.createObjectURL(file)
    }));

    setImageUploads(prev => [...prev, ...newUploads]);
  };

  const uploadImages = async () => {
    setUploadingImages(true);
    const uploadPromises = imageUploads.map(async (upload) => {
      const formData = new FormData();
      formData.append("key", upload.key);
      formData.append("file", upload.file);
      formData.append("isDefault", upload.isDefault.toString());

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        return data.image;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (imageUploads.length === 0) {
        throw new Error("Please upload at least one image");
      }

      // First create the listing
      const formData = new FormData();
      
      if (formRef.current) {
        const formElements = formRef.current.elements;
        for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          if (element.name && element.value) {
            formData.append(element.name, element.value);
          }
        }
      }

      const listingResponse = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      if (!listingResponse.ok) {
        const data = await listingResponse.json();
        throw new Error(data.error || "Failed to create listing");
      }

      const listing = await listingResponse.json();

      // Now upload images with the listing ID
      const uploadPromises = imageUploads.map(async (upload) => {
        const imageFormData = new FormData();
        imageFormData.append("key", upload.key);
        imageFormData.append("file", upload.file);
        imageFormData.append("listingId", listing.id);
        imageFormData.append("isDefault", upload.isDefault.toString());

        const response = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        // Update the image upload with the returned URL
        return {
          ...upload,
          url: data.image.url
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImageUploads(uploadedImages);

      toast.success("Listing created successfully!");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (key: string) => {
    setImageUploads(prev => prev.filter(img => img.key !== key));
  };

  const setDefaultImage = (key: string) => {
    setImageUploads(prev => 
      prev.map(img => ({
        ...img,
        isDefault: img.key === key
      }))
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create New Listing
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Fill in the details of the part you want to sell.</p>
              </div>
              <form ref={formRef} onSubmit={handleSubmit} className="mt-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select name="category" className="w-full p-2 border rounded">
                      <option value="">Select a category</option>
                      <option value="engine">Engine</option>
                      <option value="transmission">Transmission</option>
                      <option value="body">Body Parts</option>
                      <option value="interior">Interior</option>
                      <option value="exterior">Exterior</option>
                      <option value="electrical">Electrical</option>
                      <option value="suspension">Suspension</option>
                      <option value="brakes">Brakes</option>
                      <option value="wheels">Wheels & Tires</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Make</label>
                    <input
                      type="text"
                      name="make"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                      type="number"
                      name="year"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <select name="condition" className="w-full p-2 border rounded">
                      <option value="">Select condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Auction End Date</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageUploads.map((upload) => (
                      <div key={upload.key} className="relative group">
                        <img
                          src={upload.url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setDefaultImage(upload.key)}
                            className={`p-2 rounded-full ${
                              upload.isDefault ? "bg-green-500" : "bg-gray-700"
                            }`}
                            title={upload.isDefault ? "Default image" : "Set as default"}
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(upload.key)}
                            className="p-2 bg-red-500 rounded-full"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || uploadingImages}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading || uploadingImages ? "Creating..." : "Create Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 