"use client";

import { useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SigninPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);

        const result = await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirect: false,
        });

        setIsPending(false);

        if (result?.error) {
            setError("Invalid email or password");
            return;
        }
        const session = await getSession();

        router.push(session?.user?.role === "ADMIN" ? "/dashboard" : "/blog");
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 text-black">
            <div className="w-full max-w-md rounded-xl border border-gray-200 p-8 shadow-sm">
                <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
                <p className="mb-6 text-sm text-gray-500">
                    Sign in to your account to continue
                </p>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-black"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-black"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Your password"
                            required
                        />
                    </div>

                    <button
                        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium text-black underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SigninPage;
