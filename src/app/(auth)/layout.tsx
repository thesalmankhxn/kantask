import { ReactNode } from 'react';

/**
 * Auth layout component that provides a consistent layout for authentication pages
 * @param children - The child components to be rendered within the auth layout
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    );
} 