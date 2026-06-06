"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useUploadThing } from "@/app/lib/uploadthing";

type ProfileResponse = {
    name: string | null;
    bio: string | null;
    website: string | null;
    twitter: string | null;
    github: string | null;
    image: string | null;
};

const SettingsForm = () => {
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [github, setGithub] = useState("");
    const [image, setImage] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const isAuthor = session?.user?.role === "ADMIN";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("profileImage", {
        onClientUploadComplete: (res) => {
            setImage(res[0].url);
            setImageUploading(false);
        },
        onUploadError: () => {
            setError("Image upload failed. Please try again.");
            setImageUploading(false);
        },
    });

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        if (status === "unauthenticated") {
            router.replace("/signin");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile");

                if (!res.ok) {
                    setError("Unable to load your profile.");
                    return;
                }

                const data = (await res.json()) as ProfileResponse;
                setName(data.name ?? "");
                setBio(data.bio ?? "");
                setWebsite(data.website ?? "");
                setTwitter(data.twitter ?? "");
                setGithub(data.github ?? "");
                setImage(data.image ?? "");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router, status]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSaving(true);

        const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                bio,
                website,
                twitter,
                github,
                image,
            }),
        });

        const data = await res.json();
        setSaving(false);

        if (!res.ok) {
            setError(data.error ?? "Something went wrong");
            return;
        }

        setSuccess(true);
        await update({ name, image });
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setSuccess(false);
        setImageUploading(true);
        await startUpload([file]);
        e.target.value = "";
    };

    if (loading || status === "loading") {
        return (
            <div className="flex py-16 items-center justify-center">
                <p
                    className="text-sm text-[#999] font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-8">
            <div className="flex items-center gap-6 border-b border-[#E0DDD8] pb-8">
                {image ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#E0DDD8]">
                        <Image
                            src={image}
                            alt={name || "Profile picture"}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4C5B0] text-3xl font-bold text-[#8B6F4E]">
                        {name?.[0] ?? "U"}
                    </div>
                )}
                <div className="flex-1">
                    <p
                        className="mb-1 text-sm font-medium text-[#1A1A1A] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Profile picture
                    </p>
                    <p
                        className="text-xs text-[#999] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Upload a square PNG or JPG up to 2MB.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={imageUploading}
                            className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs text-[#F9F7F4] transition-colors hover:bg-[#333] disabled:opacity-60 font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {imageUploading
                                ? "Uploading..."
                                : image
                                  ? "Change image"
                                  : "Upload image"}
                        </button>
                        {image && (
                            <button
                                type="button"
                                onClick={() => setImage("")}
                                disabled={imageUploading}
                                className="rounded-full border border-[#E0DDD8] px-4 py-2 text-xs text-[#666] transition-all hover:border-[#C4B99A] hover:text-[#1A1A1A] disabled:opacity-60 font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                />
            </div>

            <div className="space-y-5">
                <h2
                    className="text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] font-sans"
                    style={{
                        fontFamily: "system-ui, sans-serif",
                        letterSpacing: "0.1em",
                    }}
                >
                    Basic Info
                </h2>

                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-[#1A1A1A] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Full name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[#E0DDD8] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors placeholder:text-[#C4B99A] focus:border-[#8B6F4E] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    />
                </div>

                <div>
                    <label
                        htmlFor="bio"
                        className="mb-1.5 block text-sm font-medium text-[#1A1A1A] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell readers a bit about yourself..."
                        rows={3}
                        maxLength={200}
                        className="w-full resize-none rounded-xl border border-[#E0DDD8] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors placeholder:text-[#C4B99A] focus:border-[#8B6F4E] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    />
                    <p
                        className="mt-1 text-right text-xs text-[#999] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        {bio.length}/200
                    </p>
                </div>
            </div>

            {isAuthor && (
                <div className="space-y-5 pt-2">
                    <h2
                        className="border-t border-[#E0DDD8] pt-8 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] font-sans"
                        style={{
                            fontFamily: "system-ui, sans-serif",
                            letterSpacing: "0.1em",
                        }}
                    >
                        Social Links
                    </h2>

                    {[
                        {
                            id: "website",
                            label: "Website",
                            value: website,
                            onChange: setWebsite,
                            placeholder: "https://yoursite.com",
                            prefix: "URL",
                        },
                        {
                            id: "twitter",
                            label: "Twitter / X",
                            value: twitter,
                            onChange: setTwitter,
                            placeholder: "username without @",
                            prefix: "@",
                        },
                        {
                            id: "github",
                            label: "GitHub",
                            value: github,
                            onChange: setGithub,
                            placeholder: "username",
                            prefix: "GH",
                        },
                    ].map((field) => (
                        <div key={field.id}>
                            <label
                                htmlFor={field.id}
                                className="mb-1.5 block text-sm font-medium text-[#1A1A1A] font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {field.label}
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#999] font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    {field.prefix}
                                </span>
                                <input
                                    id={field.id}
                                    type="text"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                    placeholder={field.placeholder}
                                    className="w-full rounded-xl border border-[#E0DDD8] bg-white py-2.5 pl-14 pr-4 text-sm text-[#1A1A1A] outline-none transition-colors placeholder:text-[#C4B99A] focus:border-[#8B6F4E] font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {error}
                </div>
            )}
            {success && (
                <div
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    Profile updated successfully.
                </div>
            )}

            <div className="flex items-center justify-between border-t border-[#E0DDD8] pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-full border border-[#E0DDD8] px-5 py-2.5 text-sm text-[#666] transition-all hover:border-[#C4B99A] hover:text-[#1A1A1A] font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving || imageUploading}
                    className="rounded-full bg-[#1A1A1A] px-6 py-2.5 text-sm text-[#F9F7F4] transition-colors hover:bg-[#333] disabled:opacity-60 font-sans"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                >
                    {saving ? "Saving..." : "Save changes"}
                </button>
            </div>
        </form>
    );
};

export default SettingsForm;
