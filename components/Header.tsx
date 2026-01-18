"use client";

import { Search, Settings, HelpCircle, Menu } from "lucide-react";

interface HeaderProps {
    onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center md:hidden">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            <div className="flex-1 max-w-2xl mx-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                    </div>
                    <input
                        type="text"
                        onChange={(e) => onSearch(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        placeholder="Search in Drive"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <HelpCircle className="w-6 h-6" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <Settings className="w-6 h-6" />
                </button>
                <div className="ml-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-gray-300">
                    U
                </div>
            </div>
        </header>
    );
}
