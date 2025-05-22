'use client';

import { useState } from 'react';

/**
 * Workspace page component that displays the main task management interface
 */
export default function WorkspacePage() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete project setup', status: 'todo' },
        { id: 2, title: 'Implement authentication', status: 'in-progress' },
        { id: 3, title: 'Design database schema', status: 'done' },
    ]);

    const addTask = () => {
        const newTask = {
            id: tasks.length + 1,
            title: 'New Task',
            status: 'todo',
        };
        setTasks([...tasks, newTask]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Workspace</h1>
                <button
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Todo Column */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">To Do</h2>
                    <div className="space-y-2">
                        {tasks
                            .filter((task) => task.status === 'todo')
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-3 bg-gray-50 rounded border border-gray-200"
                                >
                                    {task.title}
                                </div>
                            ))}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">In Progress</h2>
                    <div className="space-y-2">
                        {tasks
                            .filter((task) => task.status === 'in-progress')
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-3 bg-gray-50 rounded border border-gray-200"
                                >
                                    {task.title}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Done Column */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Done</h2>
                    <div className="space-y-2">
                        {tasks
                            .filter((task) => task.status === 'done')
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-3 bg-gray-50 rounded border border-gray-200"
                                >
                                    {task.title}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 