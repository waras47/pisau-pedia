"use client";

import { useState } from "react";

import { HttpError } from "@/shared/api/http-error";
import { uploadImage } from "@/shared/api/upload.api";

interface ImageUploadFieldProps {
  label?: string;
  image?: string;
  onChange: (url: string | undefined) => void;
  compact?: boolean;
}

export function ImageUploadField({ label, image, onChange, compact }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const size = compact ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      ) : null}
      <div className="flex items-center gap-3">
        {image ? (
          <div className={`relative ${size} shrink-0`}>
            <div className="h-full w-full overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-contain" />
            </div>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ) : null}
        <label className={`flex ${size} shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-center text-xs text-gray-400 hover:border-emerald-400 hover:text-emerald-500`}>
          {uploading ? "..." : image ? "Ganti" : "+ Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
