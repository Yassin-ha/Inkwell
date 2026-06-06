"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {

    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-[#666] hover:text-[#1A1A1A] transition-colors font-sans"
        >
            Sign out
        </button>
    );
};

export default SignOutButton;
