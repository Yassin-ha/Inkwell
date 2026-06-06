"use client";

import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
    value: string;
    onChange: (url: string) => void;
};

const CoverImageUpload = ({ value, onChange }: Props) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("coverImage", {
        onClientUploadComplete: (res) => {
            onChange(res[0].url);
            setUploading(false);
        },
        onUploadError: () => {
            setError("Upload failed. Please try again.");
            setUploading(false);
        },
    });

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        setUploading(true);
        await startUpload([file]);
    };

    return (
        <div className="space-y-3">
            {value ? (
                <div className="relative w-full h-56 rounded-xl overflow-hidden border border-[#2A2A2A] group">
                    <Image
                        src={value}
                        alt="Cover"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 text-xs bg-white text-black rounded-full font-sans hover:bg-gray-100 transition-colors"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Change image
                        </button>
                        <button
                            onClick={() => onChange("")}
                            className="px-4 py-2 text-xs bg-red-600 text-white rounded-full font-sans hover:bg-red-700 transition-colors"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-40 border-2 border-dashed border-[#2A2A2A] hover:border-[#8B6F4E] rounded-xl flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50 group"
                >
                    <span className="text-2xl text-[#555] group-hover:text-[#8B6F4E] transition-colors">
                        {uploading ? "⟳" : "↑"}
                    </span>
                    <span
                        className="text-sm text-[#555] group-hover:text-[#888] transition-colors font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {uploading
                            ? "Uploading..."
                            : "Click to upload cover image"}
                    </span>
                    <span
                        className="text-xs text-[#444] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        PNG, JPG up to 4MB
                    </span>
                </button>
            )}

            {error && (
                <p
                    className="text-xs text-red-400 font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {error}
                </p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
            />
        </div>
    );
};

export default CoverImageUpload;
