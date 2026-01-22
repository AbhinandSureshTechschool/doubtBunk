"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function Page() {
  const { id } = useParams();
  const [doubt, setDoubt] = useState({});
  const [answers, setAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("doubtBunk"));
    if (savedUser) setUser(savedUser);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/answers/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      const result = await res.json();
      if (result) {
        setDoubt(...result.doubt);
        setAnswers(result.answers)
      }
    };
    fetchData();
  }, [id, refresh]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/answers/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      const result = await res.json();
      if (result) {
        toast.success(result.message);
        setrefresh(prev => !prev);
      };
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white md:px-28 px-12 pt-40 pb-32 italic">
        {/* DOUBT SECTION */}
        <section className="mb-16">
          <div className="border border-green-400 rounded-xl p-6 bg-zinc-900">
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              {doubt.title}
            </h1>
            <p className="text-gray-300">
              {doubt.description}
            </p>
          </div>
        </section>

        {/* SOLUTIONS */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Solutions
          </h2>

          <div className="grid gap-6">
            {answers.map((answer) => (
              <div
                key={answer._id}
                className="border border-zinc-700 rounded-lg p-5 bg-zinc-950"
              >
                <p className="text-gray-200 mb-4">
                  {answer.text}
                </p>

                {answer.videoUrl && (
                  <video
                    controls
                    className="rounded-lg max-w-55 sm:max-w-70 md:max-w-[320px] shadow-md"
                  >
                    <source src={answer.videoUrl} type="video/mp4" />
                  </video>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                  <span>
                    {new Date(answer.createdAt).toLocaleDateString()}
                  </span>

                  {/* DELETE BUTTON */}
                  {user && answer.user === user.id && (
                    <button
                      onClick={() => handleDelete(answer._id)}
                      className="text-red-400 border border-red-600 px-2 py-1 text-xs rounded-lg hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}

