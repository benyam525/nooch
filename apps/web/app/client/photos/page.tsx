"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";

// Demo photos
const demoPhotos = [
  {
    id: "1",
    thumbnailUrl: null,
    photoType: "progress",
    caption: "Week 4 progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    thumbnailUrl: null,
    photoType: "meal",
    caption: "Meal prep Sunday",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    thumbnailUrl: null,
    photoType: "progress",
    caption: "Week 2 progress",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];

export default function PhotosPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"all" | "progress" | "meal">("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<"progress" | "meal">("progress");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPhotos = demoPhotos.filter(
    (photo) => activeTab === "all" || photo.photoType === activeTab
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (): void => {
    // In production, this would POST to /api/photos with FormData
    console.log("Uploading photo:", { file: uploadFile, photoType, caption });
    setShowUpload(false);
    setUploadFile(null);
    setUploadPreview(null);
    setCaption("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nooch-dark">Photos</h1>
          <p className="mt-1 text-muted-foreground">
            Track your visual progress
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Camera className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upload Photo</CardTitle>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setUploadFile(null);
                  setUploadPreview(null);
                }}
                className="rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Preview / Upload Area */}
              {uploadPreview ? (
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-coral-400 hover:bg-coral-50"
                >
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to select a photo
                  </p>
                  <p className="text-xs text-gray-400">
                    JPEG, PNG, or WebP up to 10MB
                  </p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Photo Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhotoType("progress")}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      photoType === "progress"
                        ? "border-coral-400 bg-coral-50 text-coral-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Progress
                  </button>
                  <button
                    onClick={() => setPhotoType("meal")}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      photoType === "meal"
                        ? "border-coral-400 bg-coral-50 text-coral-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Meal
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Caption (optional)</label>
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
                />
              </div>

              {/* Upload Button */}
              <Button
                className="w-full bg-coral-500 hover:bg-coral-600"
                onClick={handleUpload}
                disabled={!uploadFile}
              >
                Upload Photo
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "progress", "meal"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-coral-400 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab === "all" ? "All Photos" : tab}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square bg-muted">
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      photo.photoType === "progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {photo.photoType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {photo.createdAt.toLocaleDateString()}
                  </span>
                </div>
                {photo.caption && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {photo.caption}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">No photos yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first photo to start tracking progress
            </p>
            <Button className="mt-4" onClick={() => setShowUpload(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-700">Photo Tips</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-600">
            <li>- Take progress photos at the same time of day</li>
            <li>- Use consistent lighting and poses</li>
            <li>- Take photos from multiple angles (front, side, back)</li>
            <li>- Upload meal photos to help your coach review your nutrition</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
