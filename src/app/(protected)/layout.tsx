import { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

/**
 * Protected layout component that provides a consistent layout for authenticated pages
 * @param children - The child components to be rendered within the protected layout
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation Bar */}
            <nav className="bg-card border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/workspace" className="text-xl font-bold text-primary">
                                    KanTask
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/workspace"
                                    className="border-transparent text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Workspace
                                </Link>
                                <Link
                                    href="/settings"
                                    className="border-transparent text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Settings
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={() => {
                                    // TODO: Implement logout logic
                                    console.log('Logout clicked');
                                }}
                                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
} 