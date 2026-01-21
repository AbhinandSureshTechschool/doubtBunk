"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DoubtCard({
    title,
    description,
    onEdit,
    onDelete,
    doubId
}) {
   const [count, setCount] = useState(0);

   useEffect(() => {
    const fetchCount = async() => {
        const res = await fetch(`/api/answers/count/${doubId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        console.log(result)
        if(result) {
            setCount(result.count)
        }
    }
    fetchCount()
   },[doubId])

    return (
        <div className="w-full bg-black border border-green-500 rounded-xl p-4 shadow-md text-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="max-h-18 p-2 overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-white mb-6">
                    {description}
                </p>
            </div>


            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
                <Link href={`/answers/${doubId}`}
                    className="px-4 py-1.5 rounded-full border border-green-600 text-white font-medium hover:bg-green-800 transition"
                >
                   <span className="text-red-500 text-xs">{count > 0 && count }</span>  Solutions
                </Link>
                <button
                    onClick={onEdit}
                    className="px-4 py-1.5 rounded-full border border-blue-500 text-white font-medium hover:bg-blue-700 transition"
                >
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="px-4 py-1.5 rounded-full border border-red-500 text-white font-medium hover:bg-red-700 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
