import Link from "next/link";
import { auth } from "@/auth";
import { isAuthor } from "@/app/lib/permissions";
import SignOutButton from "../../SignOutButton";
import NavLinks from "./NavLinks";

const Navbar = async () => {
    const session = await auth();

    return (
        <nav className="sticky top-0 z-50 border-b border-[#E0DDD8] bg-[#F9F7F4]/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tight"
                    style={{
                        fontFamily: "'Georgia', serif",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Inkwell
                </Link>
                <div
                    className="hidden items-center gap-8 text-sm md:flex"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    <NavLinks />
                </div>
                {session ? (
                    <div className="flex items-center gap-3">
                        {isAuthor(session) && (
                            <Link href="/dashboard">Dashboard</Link>
                        )}
                        <Link href={`/profile/${session.user.id}`}>
                            Profile
                        </Link>
                        <Link href="/setting">Settings</Link>
                        <SignOutButton />
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/signin">Sign in</Link>
                        <Link href="/signup">Start writing</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
