'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { useMyContext } from "@/context/MyContext";

export default function Interviewbot() {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { userProfile } = useMyContext();

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login for using Interviwe Prep bot")
      return;
    }

    if (!jobRole.trim() || !jobDescription.trim()) return;

    setIsSubmitting(true);

    try {
      const userId = userProfile.UserId;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, jobRole, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create chat");
      }

      const data = await response.json();
      router.push(`/interviewbot/${data.chat.chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error instanceof Error ? error.message : error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[90vh] w-full max-w-6xl text-white p-4 pb-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#121212] p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Enter Job Details</h2>

        <label className="block mb-2">Job Role:</label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full p-2 rounded bg-[#1e1e1e] text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          placeholder="e.g., Data Scientist, UI/UX Designer..."
        />

        <label className="block mt-4 mb-2">Job Description:</label>
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full p-2 rounded bg-[#1e1e1e] text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          placeholder="Describe the role, responsibilities, and expectations in detail..."
          rows={4}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 bg-[#7d47ea] hover:bg-violet-700 p-2 rounded text-white font-semibold flex justify-center items-center gap-2 transition-all duration-200"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Submit"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
