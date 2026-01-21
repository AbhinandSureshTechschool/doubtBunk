"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LottieLoader from "./LottieLoader";

export default function AddSolutionModal({ isOpen, onClose, onSubmit }) {
    const [text, setText] = useState("");
    const [video, setVideo] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("doubtBunk"));
        if (savedUser) setUser(savedUser);
    }, []);

    if (!isOpen) return null;


    const handleSubmit = async () => {
        if(!text) {
            toast.error('please enter a valid text');
            return;
        }
        setLoading(true);
        
        if(!user) {
            toast.error("Please login before submitting...");
            router.push("/login");
            return;
        }
        let videoUrl = "";

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            const uploaded = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await uploaded.json();
            videoUrl = data.url;
        }

        onSubmit({ text, video: videoUrl });

        setText("");
        setVideo("");
        setLoading(false);
        onClose();
    };

    if(loading) {
        return (
            <LottieLoader />
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm text-xs">
            <div className="w-full max-w-lg rounded-2xl bg-green-500 p-6 text-black shadow-xl">

                <h2 className="mb-4 text-xl font-bold">Add Solution</h2>

                {/* Text Solution */}
                <textarea
                    placeholder="Write your solution..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-lg p-3 mb-4 bg-white outline-none"
                    rows={4}
                    required
                />

                {/* Video URL */}
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                    className="w-full rounded-lg p-3 mb-6 bg-white outline-none"
                    accept="video/*"
                    required
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-black px-4 py-2 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-white px-4 py-2 font-semibold"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
