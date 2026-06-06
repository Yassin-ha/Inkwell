"use client";

import { useActionState } from "react";

import Link from "next/link";
import { createAccount } from "./action";

const initialState = { error: "" };

const SignupPage = () => {
    const [state, formAction, isPending] = useActionState(
        createAccount,
        initialState,
    );

    return (
        <div className="flex min-h-screen w-full text-black items-center justify-center p-6">
            <div className="w-full max-w-md rounded-xl border border-gray-200 p-8 shadow-sm">
                <h1 className="mb-2 text-2xl font-bold">Create an account</h1>
                <p className="mb-6 text-sm">
                    Start writing and sharing your thoughts
                </p>

                {state?.error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="name"
                        >
                            Full name
                        </label>
                        <input
                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-black"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                            placeholder="Min. 8 characters"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="role"
                        >
                            I want to
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-black"
                            name="role"
                            id="role"
                            defaultValue="USER"
                        >
                            <option value="USER">Read and explore posts</option>
                            <option value="ADMIN">
                                Write and publish posts
                            </option>
                        </select>
                    </div>

                    <button
                        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/signin"
                        className="font-medium text-black underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
