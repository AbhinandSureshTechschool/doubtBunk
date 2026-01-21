'use client'

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);

  const handleSubmit = async() => {
    const formData = new FormData();
    formData.append("file", file);
    
    const uploaded = await fetch("/api/upload", {
       method: "POST" ,
       body: formData
    })
    const data = await uploaded.json();
    console.log(data.url)
  };

  return (
    <>
     <input type="file" onChange={(e) => setFile(e.target.files?.[0])} className="w-50 h-5 bg-white text-black m-2" accept="video/*" />
     <button className="p-2 m-2 bg-blue-500 rounded text-white" onClick={handleSubmit}>image submit</button>
    </>
  );
}
