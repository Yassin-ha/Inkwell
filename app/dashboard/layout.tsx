import { auth } from "@/auth";
import { isAuthor } from "@/app/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session || !isAuthor(session)) {
        redirect("/");
    }

    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <div className="flex h-screen overflow-hidden">
                {/* ── Sidebar ── */}
                <aside className="w-64 border-r border-[#E0DDD8] bg-white flex flex-col shrink-0">
                    {/* Brand */}
                    <div className="px-6 py-6 border-b border-[#E0DDD8]">
                        <Link
                            href="/"
                            className="text-xl font-bold tracking-tight text-[#1A1A1A]"
                            style={{ letterSpacing: "-0.02em" }}
                        >
                            ✦ Inkwell
                        </Link>
                        <p
                            className="text-xs text-[#999] mt-1 font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Author Dashboard
                        </p>
                    </div>

                    {/* Author info */}
                    <div className="px-6 py-5 border-b border-[#E0DDD8]">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#8B6F4E] flex items-center justify-center text-sm font-bold text-white shrink-0">
                                {session.user?.name?.[0] ?? "A"}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                                    {session.user?.name}
                                </p>
                                <p
                                    className="text-xs text-[#999] truncate font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    {session.user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {[
                            {
                                href: "/dashboard",
                                label: "Overview",
                                icon: "◈",
                            },
                            {
                                href: "/dashboard/new",
                                label: "New Post",
                                icon: "✦",
                            },
                            {
                                href: "/dashboard/posts",
                                label: "My Posts",
                                icon: "≡",
                            },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:text-[#1A1A1A] hover:bg-[#F9F7F4] transition-all"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                <span className="text-[#8B6F4E]">
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom */}
                    <div className="px-4 py-5 border-t border-[#E0DDD8] space-y-1">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:text-[#1A1A1A] hover:bg-[#F9F7F4] transition-all font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            <span className="text-[#8B6F4E]">↗</span>
                            View blog
                        </Link>
                        <div className="px-3 py-2.5">
                            <SignOutButton />
                        </div>
                    </div>
                </aside>

                {/* ── Main content ── */}
                <main className="flex-1 overflow-y-auto bg-[#F9F7F4]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
