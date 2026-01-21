"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import DoubtGCard from '../components/DoubtGCard'
import AddSolutionModal from '../components/AddSolutionModal';
import { toast } from 'sonner';

export default function Page() {
    const [doubts, setDoubts] = useState([]);
    const [addSolutionModal, setAddSolutionModal] = useState(false);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("doubtBunk"));
        if (savedUser) setUser(savedUser);
    }, []);

    useEffect(() => {
        const fetchDoubts = async () => {
            const res = await fetch(`/api/doubts`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const data = await res.json();
            if (data) {
                if (Array.isArray(data?.doubts)) {
                    setDoubts(data.doubts);
                } else {
                    setDoubts([]);
                }
            }
        }
        fetchDoubts();
    }, []);

    const handleAddSolution = async (item) => {
        setSelectedDoubt(item);
        setAddSolutionModal(true);
    };

    const handleSolutionSubmit = async (item) => {
        try {
            const data = {
               text: item.text,
               videoUrl: item.video,
               doubtId: selectedDoubt._id,
               userId: user.id
            }
            const res = await fetch(`/api/answers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const result = await res.json();
            if (result) {
                toast.success(result.message || "Answer added successful")
            }
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-black text-white md:px-28 px-12 pt-40 pb-32 italic">

                <div className="min-h-screen bg-black py-6">
                    <div className="w-full mx-auto space-y-4">
                        {doubts.map((item, index) => (
                            <DoubtGCard key={index} title={item.title} description={item.description} addSoltuion={() => handleAddSolution(item)} doubId={item._id} />
                        ))}
                    </div>
                </div>
            </main>

            {addSolutionModal && <AddSolutionModal isOpen={addSolutionModal} onClose={() => setAddSolutionModal(false)} onSubmit={handleSolutionSubmit} />}
        </>
    )
}

