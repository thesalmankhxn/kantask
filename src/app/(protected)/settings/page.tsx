'use client';

import { useState } from 'react';

/**
 * Settings page component that allows users to manage their profile and preferences
 */
export default function SettingsPage() {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        notifications: true,
        theme: 'light',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement settings update logic
        console.log('Settings update:', profile);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
                                    Email Notifications
                                </label>
                                <p className="text-sm text-gray-500">Receive email updates about your tasks</p>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifications"
                                    checked={profile.notifications}
                                    onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                Theme
                            </label>
                            <select
                                id="theme"
                                value={profile.theme}
                                onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
} 