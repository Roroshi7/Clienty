"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { useUser } from "@clerk/nextjs";
import { useMyContext } from "@/context/MyContext";

interface Chat {
    chatId: string;
    jobRole: string;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const { userProfile } = useMyContext();
    const [chats, setChats] = useState<Chat[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (userProfile?.UserId) {
            const fetchChats = async () => {
                if (!user?.id) return;
                const userId = userProfile?.UserId;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/chat/${userId}`);
                    const data = await response.json();
                    setChats(Array.isArray(data) ? data.reverse() : []);
                } catch (error) {
                    console.error("Error fetching chats:", error);
                    setChats([]);
                }
            };

            fetchChats();
        }
    }, [user, userProfile]);

    const filteredChats = chats.filter((chat) =>
        chat.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pt-[10vh] flex">
            <div className="w-72 bg-[#121212] text-white p-4 flex flex-col m-2 rounded-lg">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 bg-[#1e1e1e] text-white rounded-lg pl-12 pr-4 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all duration-200 shadow-sm border border-gray-700 hover:border-gray-500"
                    />
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    {filteredChats.length > 0 ? (
                        filteredChats.map((chat) => (
                            <Link
                                key={chat.chatId}
                                href={`/interviewbot/${chat.chatId}`}
                                className="px-3 py-2 bg-[#1e1e1e] rounded-md cursor-pointer hover:bg-[#292929] flex items-center gap-2"
                            >
                                <FiMessageSquare className="text-gray-400" />
                                <span>{chat.jobRole}</span>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm text-center mt-2">
                            No matching chats
                        </p>
                    )}
                </div>

                <Link
                    href="/interviewbot"
                    className="mt-auto flex items-center justify-center gap-2 bg-[#7d47ea] hover:bg-violet-700 text-white py-2 rounded-lg"
                >
                    <FiPlus /> New Chat
                </Link>
            </div>
            {children}
        </div>
    );
};

export default Layout;
