import Navbar from "@/components/home/Nav/Navbar";
import Link from "next/link";

// Mock data - replace with real Prisma queries later
const featuredPost = {
    id: "1",
    title: "The Art of Writing Code That Humans Can Read",
    excerpt:
        "Clean code is not just about making machines execute instructions — it's about communicating intent to the next developer who reads your work, including your future self.",
    author: { name: "Alex Morgan", image: null },
    createdAt: "May 12, 2026",
    readTime: "6 min read",
    tag: "Engineering",
    slug: "art-of-writing-readable-code",
};

const posts = [
    {
        id: "2",
        title: "Why Every Developer Should Keep a Technical Journal",
        excerpt:
            "Writing about what you build helps you understand it better and creates a trail of growth you can look back on.",
        author: { name: "Sara Chen" },
        createdAt: "May 10, 2026",
        readTime: "4 min read",
        tag: "Productivity",
        slug: "developer-technical-journal",
    },
    {
        id: "3",
        title: "Understanding Next.js App Router: A Deep Dive",
        excerpt:
            "The App Router changed how we think about routing, layouts, and data fetching in Next.js applications.",
        author: { name: "James Lee" },
        createdAt: "May 8, 2026",
        readTime: "8 min read",
        tag: "Next.js",
        slug: "nextjs-app-router-deep-dive",
    },
    {
        id: "4",
        title: "Designing for Developers: UI Principles That Actually Matter",
        excerpt:
            "Good UI isn't decoration. It's the difference between a tool people love and one they tolerate.",
        author: { name: "Mia Torres" },
        createdAt: "May 5, 2026",
        readTime: "5 min read",
        tag: "Design",
        slug: "ui-principles-for-developers",
    },
    {
        id: "5",
        title: "PostgreSQL Performance: Indexing Strategies You Need",
        excerpt:
            "Most slow queries aren't slow because of bad code — they're slow because of missing or wrong indexes.",
        author: { name: "Omar Khalil" },
        createdAt: "May 3, 2026",
        readTime: "7 min read",
        tag: "Database",
        slug: "postgresql-indexing-strategies",
    },
];

type HomePost = (typeof posts)[number];

const tags = [
    "All",
    "Engineering",
    "Next.js",
    "Design",
    "Database",
    "Productivity",
    "Career",
];

export default function HomePage() {
    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            {/* Navbar  */}
            <Navbar />

            {/* ── Hero / Masthead ── */}
            <header className="border-b border-[#E0DDD8] py-16 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Headline */}
                        <div>
                            <span className="inline-block text-xs tracking-[0.2em] uppercase text-[#8B6F4E] mb-4 font-sans">
                                Featured Story
                            </span>
                            <h1
                                className="text-4xl md:text-5xl font-bold leading-[1.15] mb-5 text-[#1A1A1A]"
                                style={{ letterSpacing: "-0.03em" }}
                            >
                                {featuredPost.title}
                            </h1>
                            <p
                                className="text-[#555] text-lg leading-relaxed mb-6 font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-8 h-8 rounded-full bg-[#D4C5B0] flex items-center justify-center text-xs font-bold text-[#8B6F4E]">
                                    {featuredPost.author.name[0]}
                                </div>
                                <div
                                    className="text-sm font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    <span className="text-[#1A1A1A] font-medium">
                                        {featuredPost.author.name}
                                    </span>
                                    <span className="text-[#999] mx-2">·</span>
                                    <span className="text-[#999]">
                                        {featuredPost.createdAt}
                                    </span>
                                    <span className="text-[#999] mx-2">·</span>
                                    <span className="text-[#999]">
                                        {featuredPost.readTime}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/blog/${featuredPost.slug}`}
                                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F7F4] px-6 py-3 rounded-full text-sm hover:bg-[#333] transition-colors font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Read article
                                <span>→</span>
                            </Link>
                        </div>

                        {/* Right: Decorative card */}
                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-[#E8E0D5] rounded-2xl rotate-2"></div>
                            <div className="relative bg-[#1A1A1A] rounded-2xl p-10 text-[#F9F7F4]">
                                <div className="text-xs tracking-[0.2em] uppercase text-[#8B6F4E] mb-6 font-sans">
                                    {featuredPost.tag}
                                </div>
                                <p
                                    className="text-2xl font-bold leading-snug mb-8"
                                    style={{ letterSpacing: "-0.02em" }}
                                >
                                    &ldquo;Code is read more often than it is
                                    written.&rdquo;
                                </p>
                                <div className="flex items-center gap-3 pt-6 border-t border-[#333]">
                                    <div className="w-10 h-10 rounded-full bg-[#8B6F4E] flex items-center justify-center text-sm font-bold">
                                        {featuredPost.author.name[0]}
                                    </div>
                                    <div
                                        className="font-sans text-sm"
                                        style={{
                                            fontFamily: "system-ui, sans-serif",
                                        }}
                                    >
                                        <div className="text-[#F9F7F4] font-medium">
                                            {featuredPost.author.name}
                                        </div>
                                        <div className="text-[#888]">
                                            {featuredPost.readTime}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Tag Filter ── */}
            <section className="border-b border-[#E0DDD8] px-6 py-4">
                <div className="mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {tags.map((tag: string, i: number) => (
                        <button
                            key={tag}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors font-sans ${
                                i === 0
                                    ? "bg-[#1A1A1A] text-[#F9F7F4]"
                                    : "bg-[#EDEAE5] text-[#666] hover:bg-[#E0DDD8] hover:text-[#1A1A1A]"
                            }`}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Post Grid ── */}
            <main className="mx-auto max-w-6xl px-6 py-14">
                <div className="flex items-center justify-between mb-10">
                    <h2
                        className="text-xl font-bold"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Latest Articles
                    </h2>
                    <Link
                        href="/blog"
                        className="text-sm text-[#8B6F4E] hover:text-[#1A1A1A] transition-colors font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        View all →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post: HomePost, i: number) => (
                        <article
                            key={post.id}
                            className={`group ${i === 0 ? "md:col-span-2" : ""}`}
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <div
                                    className={`border border-[#E0DDD8] rounded-2xl p-7 bg-white hover:border-[#C4B99A] hover:shadow-md transition-all duration-200 ${i === 0 ? "flex flex-col md:flex-row gap-8 items-start" : ""}`}
                                >
                                    {/* Tag */}
                                    <div className={i === 0 ? "md:w-1/3" : ""}>
                                        <span
                                            className="inline-block text-xs tracking-[0.15em] uppercase text-[#8B6F4E] mb-3 font-sans"
                                            style={{
                                                fontFamily:
                                                    "system-ui, sans-serif",
                                            }}
                                        >
                                            {post.tag}
                                        </span>
                                        <h3
                                            className={`font-bold leading-snug text-[#1A1A1A] group-hover:text-[#8B6F4E] transition-colors ${i === 0 ? "text-2xl" : "text-lg"}`}
                                            style={{ letterSpacing: "-0.02em" }}
                                        >
                                            {post.title}
                                        </h3>
                                    </div>

                                    <div className={i === 0 ? "md:w-2/3" : ""}>
                                        <p
                                            className="text-[#666] text-sm leading-relaxed mt-2 mb-5 font-sans"
                                            style={{
                                                fontFamily:
                                                    "system-ui, sans-serif",
                                            }}
                                        >
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-[#D4C5B0] flex items-center justify-center text-xs font-bold text-[#8B6F4E]">
                                                {post.author.name[0]}
                                            </div>
                                            <div
                                                className="text-xs text-[#999] font-sans"
                                                style={{
                                                    fontFamily:
                                                        "system-ui, sans-serif",
                                                }}
                                            >
                                                <span className="text-[#555] font-medium">
                                                    {post.author.name}
                                                </span>
                                                <span className="mx-1.5">
                                                    ·
                                                </span>
                                                <span>{post.createdAt}</span>
                                                <span className="mx-1.5">
                                                    ·
                                                </span>
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </main>

            {/* ── CTA Banner ── */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="bg-[#1A1A1A] rounded-3xl px-10 py-14 text-center text-[#F9F7F4]">
                    <span className="text-xs tracking-[0.2em] uppercase text-[#8B6F4E] font-sans block mb-4">
                        For Writers
                    </span>
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Have something worth saying?
                    </h2>
                    <p
                        className="text-[#999] text-base mb-8 max-w-lg mx-auto font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Join Inkwell and share your ideas with a community of
                        curious readers and developers.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 bg-[#F9F7F4] text-[#1A1A1A] px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#E8E0D5] transition-colors font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Start writing for free →
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-[#E0DDD8] px-6 py-8">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <span
                        className="text-lg font-bold"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        ✦ Inkwell
                    </span>
                    <p
                        className="text-sm text-[#999] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        © {new Date().getFullYear()} Inkwell. Built with Next.js
                        & love.
                    </p>
                    <div
                        className="flex gap-6 text-sm text-[#999] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        <Link
                            href="/signin"
                            className="hover:text-[#1A1A1A] transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="hover:text-[#1A1A1A] transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
