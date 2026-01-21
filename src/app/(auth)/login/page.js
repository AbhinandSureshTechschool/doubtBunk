"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const [form, setFrom] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();

    const handleChange = (e) => {
        setFrom({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Login failed");
                return;
            }
            
            toast.success(data.message || "User login successfully");
            
            localStorage.setItem("doubtBunk", JSON.stringify(data.user));
            router.push("/");
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 text-xs">
            {/* Card */}
            <div className="w-full max-w-md bg-green-500 rounded-2xl p-8 shadow-xl">

                <h2 className="text-2xl font-bold text-black text-center mb-6">
                    Welcome Back
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
                    >
                        Sign In
                    </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-black text-center mt-6">
                    Don’t have an account?{" "}
                    <Link href="/register" className="font-semibold cursor-pointer underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;
