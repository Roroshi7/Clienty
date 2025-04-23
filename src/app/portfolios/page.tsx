"use client"

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import portfolio1 from "@/assets/Portfolio1.png"
import { useMyContext } from "@/context/MyContext";



export default function Portfolios() {
  const { userProfile } = useMyContext();
  const templates = [
    {
      id: 1,
      name: "Developer Portfolio",
      thumbnail: portfolio1,
      previewLink: `https://myai-portfolio.vercel.app/?id=${userProfile.UserId}`,
      customizeLink: "",
    },

  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Portfolio Templates</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className="bg-[#121212] rounded-xl overflow-hidden shadow-lg p-4 border border-[#7d47ea]"
          >
            <Image
              src={template.thumbnail}
              alt={template.name}
              width={400}
              height={250}
              className="rounded-lg object-cover"
            />

            <h2 className="text-lg font-semibold mt-4">{template.name}</h2>

            <div className="flex gap-4 mt-4">
              <motion.a
                href={template.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="flex-1 text-center bg-[#7d47ea] hover:bg-[#5a32c4] transition-all py-2 rounded-lg font-semibold"
              >
                Preview
              </motion.a>
              <motion.a
                href={template.customizeLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="flex-1 text-center bg-[#222] hover:bg-[#333] border border-[#7d47ea] py-2 rounded-lg font-semibold"
              >
                Customize
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
