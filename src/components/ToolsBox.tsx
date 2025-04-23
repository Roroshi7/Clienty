"use client";
import Image from "next/image";
import React from "react";
import tool1 from "@/assets/Tool1.png"
import tool2 from "@/assets/Tool2.png"
import tool3 from "@/assets/Tool3.png"
import tool4 from "@/assets/Tool4.png"
import { Bot, BrainCircuit, Megaphone, Route } from "lucide-react";

export function ToolsBox() {
    return (
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 md:auto-rows-[20rem] max-w-7xl mx-auto -mt-48 z-100">
            <div className="rounded-2xl bg-[#504CFF] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between md:col-span-3">
                <div className="grid grid-cols-2 p-8">
                    <div>
                        <div className="flex items-center justify-center rounded-full w-16 h-16 bg-[#FFFFFF]/40 border-white/40 border mb-4">
                            <Megaphone width={"36px"} height={"36px"} />
                        </div>
                        <h1 className="text-3xl font-semibold mb-8">AI Career Advisor</h1>
                        <p>optimize your resume, enhance skills, and get expert job insights for a successful career journey.</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Image src={tool1} alt="AI Tool 1" />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#171717] to-[#854CFF]/50 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between md:col-span-2">
                <div className="grid grid-cols-2 p-8">
                    <div>
                        <div className="flex items-center justify-center rounded-full w-16 h-16 bg-[#FFFFFF]/40 border-white/40 border mb-4">
                            <BrainCircuit width={"36px"} height={"36px"} />
                            {/* <Brain width={"36px"} height={"36px"} /> */}
                        </div>
                        <h1 className="text-2xl font-semibold mb-8">AI Powered Resume Builder</h1>
                        <p>AI-powered resume builder—showcase your skills and experience effortlessly!</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Image src={tool2} alt="AI Tool 2" className="-mr-12 -mb-12" />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#171717] to-[#504CFF]/50 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden hidden md:flex flex-col justify-between md:col-span-2">
                <div className="grid grid-cols-2 p-8">
                    <div>
                        <div className="flex items-center justify-center rounded-full w-16 h-16 bg-[#FFFFFF]/40 border-white/40 border mb-4">
                            <Route width={"36px"} height={"36px"} />
                        </div>
                        <h1 className="text-2xl font-semibold mb-8">Career Road Maps</h1>
                        <p>receive a tailored roadmap with step-by-step guidance to achieve your professional goals.</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Image src={tool3} alt="AI Tool 3" />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-[#854CFF] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between md:col-span-3">
                <div className="grid grid-cols-2 p-8">
                    <div>
                        <div className="flex items-center justify-center rounded-full w-16 h-16 bg-[#FFFFFF]/40 border-white/40 border mb-4">
                            <Bot width={"36px"} height={"36px"} />
                        </div>
                        <h1 className="text-3xl font-semibold mb-8">Interview Preparation & AI FAQ Preparation Bot</h1>
                        <p>Ace your interviews with AI-driven prep! Get common questions, smart answers, and real-time resume insights from our AI-powered chatbot.</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Image src={tool4} alt="AI Tool 4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
