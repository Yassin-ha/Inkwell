"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Articles" },
    { href: "/about", label: "About" },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const isActive =
                    link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-colors hover:text-[#8B6F4E] ${
                            isActive ? "text-[#1A1A1A]" : "text-[#666]"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </>
    );
}
