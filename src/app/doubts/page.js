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
    const [searchText, setSearchText] = useState("");

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

    const filteredDoubts = doubts.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );


    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-black text-white md:px-28 px-12 pt-40 pb-32 italic">

                {/* Searxch bar */}
                <div className='w-full p-2 flex justify-center'>
                    <div className='max-w-full'>
                        <input type="text" id="input" data-testid="search-input" className='w-60 p-2 m-2 rounded-full bg-gray-900 text-white border border-black focus:border-green-500 focus:outline-none' onChange={(e) => setSearchText(e.target.value)} />
                    </div>
                </div>

                <div className="min-h-screen bg-black py-6">
                    <div className="w-full mx-auto space-y-4">
                        {filteredDoubts.map((item, index) => (
                            <DoubtGCard 
                            key={index} 
                            title={item.title} 
                            description={item.description} 
                            addSoltuion={() => handleAddSolution(item)} doubId={item._id} 
                            />
                        ))}
                    </div>
                </div>

            </main>

            {addSolutionModal && <AddSolutionModal isOpen={addSolutionModal} onClose={() => setAddSolutionModal(false)} onSubmit={handleSolutionSubmit} />}
        </>
    )
}

