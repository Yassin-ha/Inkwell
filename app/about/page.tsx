import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Navbar from "@/components/home/Nav/Navbar";

type AboutStat = {
    value: number | string;
    label: string;
};

type AboutStep = {
    step: string;
    title: string;
    description: string;
};

type TechItem = {
    name: string;
    desc: string;
};

const AboutPage = async () => {
    const session = await auth();

    // Fetch some real stats
    const [totalPosts, totalAuthors] = await Promise.all([
        prisma.post.count({ where: { published: true } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
    ]);

    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <Navbar />

            {/* Hero */}
            <header className="border-b border-[#E0DDD8] py-20 px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <span
                        className="inline-block text-xs tracking-[0.2em] uppercase text-[#8B6F4E] mb-4 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        About Inkwell
                    </span>
                    <h1
                        className="text-5xl font-bold mb-6 leading-tight"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        A place for ideas worth sharing
                    </h1>
                    <p
                        className="text-lg text-[#666] leading-relaxed max-w-xl mx-auto font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Inkwell is a blog platform where developers, designers,
                        and thinkers write about what they know, what they&apos;re
                        learning, and what they believe.
                    </p>
                </div>
            </header>

            {/* Stats */}
            <section className="border-b border-[#E0DDD8] py-12 px-6">
                <div className="mx-auto max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    {[
                        { value: totalPosts, label: "Articles published" },
                        { value: totalAuthors, label: "Authors writing" },
                        { value: "100%", label: "Free to read" },
                    ].map((stat: AboutStat) => (
                        <div key={stat.label}>
                            <p
                                className="text-4xl font-bold text-[#1A1A1A] mb-1"
                                style={{ letterSpacing: "-0.04em" }}
                            >
                                {stat.value}
                            </p>
                            <p
                                className="text-sm text-[#999] font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-6 border-b border-[#E0DDD8]">
                <div className="mx-auto max-w-3xl">
                    <span
                        className="inline-block text-xs tracking-[0.2em] uppercase text-[#8B6F4E] mb-4 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Our Mission
                    </span>
                    <h2
                        className="text-3xl font-bold mb-6"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Writing that teaches, inspires, and connects
                    </h2>
                    <div
                        className="space-y-4 text-[#555] text-base leading-relaxed font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        <p>
                            We built Inkwell because we believe the best way to
                            learn something deeply is to write about it. When
                            you explain a concept clearly enough for someone
                            else to understand, you truly understand it
                            yourself.
                        </p>
                        <p>
                            Every article on Inkwell is written by a real person
                            with real experience not generated, not rephrased,
                            not recycled. Just honest writing from people who
                            care about their craft.
                        </p>
                        <p>
                            Whether you&apos;re here to read or to write, we hope
                            Inkwell becomes a place you come back to.
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-6 border-b border-[#E0DDD8]">
                <div className="mx-auto max-w-3xl">
                    <span
                        className="inline-block text-xs tracking-[0.2em] uppercase text-[#8B6F4E] mb-4 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        How It Works
                    </span>
                    <h2
                        className="text-3xl font-bold mb-10"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Simple by design
                    </h2>

                    <div className="space-y-8">
                        {[
                            {
                                step: "01",
                                title: "Read freely",
                                description:
                                    "Every published article is free to read — no paywall, no account required. Just open a post and start reading.",
                            },
                            {
                                step: "02",
                                title: "Create an account to interact",
                                description:
                                    "Sign up as a reader to like articles and join the conversation in the comments. Your reactions help authors know what resonates.",
                            },
                            {
                                step: "03",
                                title: "Become an author",
                                description:
                                    "Sign up as an author to get access to the writing dashboard. Write your post, add a cover image, tag it, and publish when you're ready.",
                            },
                            {
                                step: "04",
                                title: "Build your profile",
                                description:
                                    "Every author gets a public profile page showcasing their articles, stats, and social links. Your writing becomes your portfolio.",
                            },
                        ].map((item: AboutStep) => (
                            <div key={item.step} className="flex gap-6">
                                <div
                                    className="text-3xl font-bold text-[#E0DDD8] shrink-0 w-12"
                                    style={{ letterSpacing: "-0.04em" }}
                                >
                                    {item.step}
                                </div>
                                <div>
                                    <h3
                                        className="text-lg font-bold mb-1.5"
                                        style={{ letterSpacing: "-0.01em" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-[#666] text-sm leading-relaxed font-sans"
                                        style={{
                                            fontFamily: "system-ui, sans-serif",
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Built with */}
            <section className="py-16 px-6 border-b border-[#E0DDD8]">
                <div className="mx-auto max-w-3xl">
                    <span
                        className="inline-block text-xs tracking-[0.2em] uppercase text-[#8B6F4E] mb-4 font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Tech Stack
                    </span>
                    <h2
                        className="text-3xl font-bold mb-8"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Built with modern tools
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            {
                                name: "Next.js 15",
                                desc: "App Router + Server Components",
                            },
                            {
                                name: "TypeScript",
                                desc: "Type-safe throughout",
                            },
                            {
                                name: "Prisma ORM",
                                desc: "Type-safe database queries",
                            },
                            { name: "PostgreSQL", desc: "Hosted on Supabase" },
                            {
                                name: "NextAuth v5",
                                desc: "Authentication & sessions",
                            },
                            { name: "Uploadthing", desc: "Image uploads" },
                            { name: "TipTap", desc: "Rich text editor" },
                            {
                                name: "Tailwind CSS",
                                desc: "Utility-first styling",
                            },
                            { name: "Vercel", desc: "Deployment & hosting" },
                        ].map((tech: TechItem) => (
                            <div
                                key={tech.name}
                                className="bg-white border border-[#E0DDD8] rounded-xl p-4 hover:border-[#C4B99A] transition-colors"
                            >
                                <p
                                    className="text-sm font-bold text-[#1A1A1A] mb-0.5"
                                    style={{ letterSpacing: "-0.01em" }}
                                >
                                    {tech.name}
                                </p>
                                <p
                                    className="text-xs text-[#999] font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    {tech.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-3xl text-center">
                    {session ? (
                        <>
                            <h2
                                className="text-3xl font-bold mb-4"
                                style={{ letterSpacing: "-0.03em" }}
                            >
                                Welcome back,{" "}
                                {session.user?.name?.split(" ")[0]} ✦
                            </h2>
                            <p
                                className="text-[#666] mb-8 font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Head back to the blog and keep exploring.
                            </p>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F7F4] px-6 py-3 rounded-full text-sm hover:bg-[#333] transition-colors font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Browse articles →
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2
                                className="text-3xl font-bold mb-4"
                                style={{ letterSpacing: "-0.03em" }}
                            >
                                Ready to join?
                            </h2>
                            <p
                                className="text-[#666] mb-8 font-sans"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Create a free account to like, comment, or start
                                writing your own articles.
                            </p>
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F7F4] px-6 py-3 rounded-full text-sm hover:bg-[#333] transition-colors font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    Create account →
                                </Link>
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 border border-[#E0DDD8] text-[#666] px-6 py-3 rounded-full text-sm hover:border-[#C4B99A] hover:text-[#1A1A1A] transition-colors font-sans"
                                    style={{
                                        fontFamily: "system-ui, sans-serif",
                                    }}
                                >
                                    Browse articles
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#E0DDD8] px-6 py-8">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="text-lg font-bold"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        ✦ Inkwell
                    </Link>
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
                            href="/blog"
                            className="hover:text-[#1A1A1A] transition-colors"
                        >
                            Articles
                        </Link>
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
};

export default AboutPage;
