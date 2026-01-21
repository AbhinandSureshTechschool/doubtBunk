"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("doubtBunk"));
        if (savedUser) setUser(savedUser);
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem("doubtBunk");
        setUser(null);
        router.push("/login")
    }

    return (
        <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
            <div className="flex items-center justify-between w-[90vw] max-w-6xl px-8 py-3 rounded-full bg-green-500 text-black shadow-lg backdrop-blur-md">
                <span className="font-semibold text-md italic">Doubt<span className="font-semibold text-md text-white">Bunk</span> </span>

                <div className="flex items-center gap-4 italic">
                    {user ? <>
                        <button onClick={handleLogout} className="px-4 py-1.5 text-xs rounded-full bg-black text-white border border-white hover:bg-gray-800 transition">
                            Logout
                        </button>
                         <Link href="/doubts" className="px-4 py-1.5 text-xs rounded-full  bg-black border border-white text-white hover:bg-gray-800 transition">
                            All Doubts
                        </Link>
                        </>
                        :
                        <Link href="/login">
                            <button className="px-4 py-1.5 text-xs rounded-full bg-black text-white hover:bg-gray-800 transition">
                                Sign In
                            </button>
                        </Link>}
                </div>
            </div>
        </nav>
    );
}
