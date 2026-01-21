"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import DoubtModal from "./components/DoubtModal";
import { toast } from "sonner";
import DoubtCard from "./components/DoubtCard";
import DoubtEditModal from "./components/DoubtEditModal";
import LottieLoader from "./components/LottieLoader";


export default function Home() {
  const [addDoubtModal, setAddDoubtModal] = useState(false);
  const [editDoubtModal, setEditDoubtModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [user, setUser] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("doubtBunk"));
    if (savedUser) setUser(savedUser);
  }, []);

  useEffect(() => {
    const fetchDoubts = async () => {
      if (!user?.id) return;
      setLoading(true);
      const res = await fetch(`/api/doubts/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      const data = await res.json();
      if (data) {
        if (Array.isArray(data?.doubts)) {
          setDoubts(data.doubts);
          setLoading(false);
        } else {
          setDoubts([]);
        }
      }
    }
    fetchDoubts();

  }, [addDoubtModal, user, refresh])

  const handleAddDoubtSubmit = async (data) => {
    try {
      setLoading(true);
      data.user = user.id;
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData) {
        toast.success(resData.message)
      };
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  }

  const handleDoubtDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/doubts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if(result) {
        toast.success(result.message);
        setRefresh(prev => !prev)
        return;
      };
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEditModal = (item) => {
    setSelectedDoubt(item);
    setEditDoubtModal(true);
  }

  const handleEditDoubtSubmit = async(data) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/doubts/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if(result) {
        toast.success(result.message);
        setRefresh(prev => !prev)
        return;
      };
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  }

  if(loading) {
    return (
      <LottieLoader />
    )
  }

  return (
    <>
      <Navbar />


      {/* Main content */}
      <main className="min-h-screen bg-black text-white md:px-28 px-12 pt-40 pb-32 italic">
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left side content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Clear Your Doubts. <br /> Share Knowledge.
            </h1>

            <p className="text-gray-300 text-lg">
              A modern doubt-clearance platform where users can ask questions,
              share solutions, and collaborate through text and video responses.
            </p>

            <ul className="text-gray-400 space-y-2">
              <li>• Ask & manage doubts</li>
              <li>• Text & video solutions</li>
              <li>• Secure authentication</li>
            </ul>
          </div>

          {/* Right side image */}
          <div className="relative w-full h-87.5 md:h-105 rounded-xl overflow-hidden">
            <Image
              src="/auth/homePageImage.png" // replace with your image
              alt="Doubt platform preview"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </section>

        {/* Doubt add and other area */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-10">
          <p className="text-xl font-bold text-green-500">Add Your Doubts & Get Solutions</p>
          <button onClick={() => setAddDoubtModal(true)} className="p-2 bg-green-500 rounded-lg hover:bg-black transition hover:border border-white text-xs border">Add Doubt</button>
        </div>

        <div className="min-h-screen bg-black py-6">
          <div className="w-full mx-auto space-y-4">
            {doubts.map((item, index) => (
              <DoubtCard key={index} title={item.title} description={item.description} onEdit={() => handleEditModal(item) } onDelete={() => handleDoubtDelete(item._id)} doubId={item._id}/>
            )) }
          </div>
        </div>

      </main>

      {/* Add doubt modal */}
      {addDoubtModal && <DoubtModal isOpen={addDoubtModal} onClose={() => setAddDoubtModal(false)} onSubmit={handleAddDoubtSubmit} />}
      {/* Edit doubt modal */}
        {editDoubtModal && <DoubtEditModal isOpen={editDoubtModal} onClose={() => setEditDoubtModal(false)} onSubmit={handleEditDoubtSubmit} doubt={selectedDoubt} /> }
    </>
  );
}
