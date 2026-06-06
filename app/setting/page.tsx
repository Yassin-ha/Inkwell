import Navbar from "@/components/home/Nav/Navbar";
import SettingsForm from "./SettingsForm";

const SettingsPage = () => {
    return (
        <div
            className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
            style={{ fontFamily: "'Georgia', serif" }}
        >
            <Navbar />

            <main className="mx-auto max-w-2xl px-6 py-12">
                <div className="mb-10">
                    <h1
                        className="mb-1 text-3xl font-bold"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        Settings
                    </h1>
                    <p
                        className="text-sm text-[#999] font-sans"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Manage your profile and account
                    </p>
                </div>

                <SettingsForm />
            </main>
        </div>
    );
};

export default SettingsPage;
