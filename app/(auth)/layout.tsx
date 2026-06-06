import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            <div className="flex items-center justify-center pt-10">
                <Link href="/" className="text-xl font-bold text-black">
                    BlogApp
                </Link>
            </div>

            <main className="flex flex-1 items-center justify-center px-4">
                {children}
            </main>

            <div className="pb-6 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} BlogApp. All rights reserved.
            </div>
        </div>
    );
};

export default AuthLayout;
