"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DoubtModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("doubtBunk"));
    if (savedUser) setUser(savedUser);
  }, []);

  if (!isOpen) return null; // hide if not open

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login before submitting...");
      router.push("/login");
      return;
    }
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-xs">
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-green-500 rounded-xl p-8 w-full max-w-md shadow-lg z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black font-bold text-lg"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-black mb-6 text-center">
          Add a <span className="text-xl font-bold text-white mb-6 text-center">Doubt</span>
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 bg-white text-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 bg-white text-black py-2 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            Add Doubt
          </button>
        </form>
      </div>
    </div>
  );
}
