import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const { user } = session;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut();
                                }}
                            >
                                <button
                                    type="submit"
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium">Welcome, {user.name}!</h2>
                    <p className="mt-2 text-gray-600">Email: {user.email}</p>
                    {user.image && (
                        <img
                            src={user.image}
                            alt="Profile"
                            className="mt-4 h-20 w-20 rounded-full"
                        />
                    )}
                </div>
            </main>
        </div>
    );
} 