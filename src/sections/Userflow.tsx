"use client"

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { motion } from 'framer-motion';
import { RippleComponent } from "@/components/RippleComponent";

export function Userflow() {

    const steps = [
        // AI Career Advisor
        [
            {
                step: "Step 1",
                title: "Describe Your Career Goals",
                description: "Enter your interests, skills, and aspirations to receive personalized career guidance.",
            },
            {
                step: "Step 2",
                title: "AI-Powered Career Analysis",
                description: "Our AI evaluates your input and suggests the best career paths tailored for you.",
            },
            {
                step: "Step 3",
                title: "Get Actionable Insights",
                description: "Receive detailed recommendations on skills, certifications, and job opportunities.",
            },
            {
                step: "Step 4",
                title: "Start Taking Action",
                description: "Follow your personalized roadmap and track progress towards your dream career.",
            },
        ],

        // Roadmap for Success
        [
            {
                step: "Step 1",
                title: "Enter Your Desired Career",
                description: "Type in the career or industry you want to explore.",
            },
            {
                step: "Step 2",
                title: "AI-Generated Roadmap",
                description: "Our AI creates a step-by-step learning and career plan based on market trends.",
            },
            {
                step: "Step 3",
                title: "Discover Learning Resources",
                description: "Get recommendations for courses, books, and projects to enhance your skills.",
            },
            {
                step: "Step 4",
                title: "Track Your Progress",
                description: "Use our platform to mark completed steps and stay on track.",
            },
        ],

        // Portfolio Website Generator
        [
            {
                step: "Step 1",
                title: "Enter Your Details",
                description: "Provide your name, experience, skills, and achievements to create your resume.",
            },
            {
                step: "Step 2",
                title: "Choose a Template",
                description: "Select from professionally designed resume templates that suit your style.",
            },
            {
                step: "Step 3",
                title: "Generate & Customize",
                description: "Our AI instantly creates your resume, which you can customize to perfection.",
            },
            {
                step: "Step 4",
                title: "Download & Share",
                description: "Get your polished resume in multiple formats ready to share with employers.",
            },
        ],

        // AI Interview Prep Bot
        [
            {
                step: "Step 1",
                title: "Select Your Role",
                description: "Choose the job role you're preparing for to tailor the interview experience.",
            },
            {
                step: "Step 2",
                title: "Practice Realistic Questions",
                description: "Our AI asks industry-specific questions to simulate a real interview.",
            },
            {
                step: "Step 3",
                title: "Get Instant Feedback",
                description: "Receive AI-driven insights on your answers, highlighting strengths and areas for improvement.",
            },
            {
                step: "Step 4",
                title: "Refine & Improve",
                description: "Practice multiple rounds and gain confidence for your actual interview.",
            },
        ],
    ];

    const data = [
        {
            title: "AI Career Advisor",
            content: (
                <div>
                    <p className="text-neutral-300 text-xs md:text-lg font-normal mb-8">
                    Get personalized career recommendations and insights to choose the best path for your future.
                    </p>
                    <section className="bg-[#0A0A0A] text-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-2 md:gap-6">
                                {steps[0].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-[#121212] p-4 md:p-6 rounded-lg shadow-lg hover:shadow-[#7D47EA]/50 transition-shadow duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.2 }}
                                    >
                                        <h3 className="hidden md:block text-xl font-semibold text-[#7D47EA]">
                                            {step.step}
                                        </h3>
                                        <h4 className="mt-2 text-md md:text-lg font-medium md:font-bold text-white">{step.title}</h4>
                                        <p className="hidden md:block mt-4 text-neutral-300">{step.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            ),
        },
        {
            title: "Roadmap for Success",
            content: (
                <div>
                    <p className="text-neutral-300 text-xs md:text-lg font-normal mb-8">
                    Follow a step-by-step AI-generated plan to upskill and achieve your career goals.
                    </p>
                    <section className="bg-[#0A0A0A] text-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-2 md:gap-6">
                                {steps[1].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-[#121212] p-4 md:p-6 rounded-lg shadow-lg hover:shadow-[#7D47EA]/50 transition-shadow duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.2 }}
                                    >
                                        <h3 className="hidden md:block text-xl font-semibold text-[#7D47EA]">
                                            {step.step}
                                        </h3>
                                        <h4 className="mt-2 text-md md:text-lg font-medium md:font-bold text-white">{step.title}</h4>
                                        <p className="hidden md:block mt-4 text-neutral-300">{step.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            ),
        },
        {
            title: "Resume Builder",
            content: (
                <div>
                    <p className="text-neutral-300 text-xs md:text-lg font-normal mb-4">
                    Instantly create a professional resume to showcase your skills and experience.
                    </p>
                    <section className="bg-[#0A0A0A] text-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-2 md:gap-6">
                                {steps[2].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-[#121212] p-4 md:p-6 rounded-lg shadow-lg hover:shadow-[#7D47EA]/50 transition-shadow duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.2 }}
                                    >
                                        <h3 className="hidden md:block text-xl font-semibold text-[#7D47EA]">
                                            {step.step}
                                        </h3>
                                        <h4 className="mt-2 text-md md:text-lg font-medium md:font-bold text-white">{step.title}</h4>
                                        <p className="hidden md:block mt-4 text-neutral-300">{step.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            ),
        },
        {
            title: "AI Interview Prep Bot",
            content: (
                <div>
                    <p className="text-neutral-300 text-xs md:text-lg font-normal mb-4">
                    Practice real interview questions and receive AI-driven feedback to boost your confidence.
                    </p>
                    <section className="bg-[#0A0A0A] text-white">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-2 md:gap-6">
                                {steps[3].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-[#121212] p-4 md:p-6 rounded-lg shadow-lg hover:shadow-[#7D47EA]/50 transition-shadow duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.2 }}
                                    >
                                        <h3 className="hidden md:block text-xl font-semibold text-[#7D47EA]">
                                            {step.step}
                                        </h3>
                                        <h4 className="mt-2 text-md md:text-lg font-medium md:font-bold text-white">{step.title}</h4>
                                        <p className="hidden md:block mt-4 text-neutral-300">{step.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            ),
        },

    ];
    return (
        <div className="w-full">
            <RippleComponent />
            <div className="-mt-10">
                <Timeline data={data} />
            </div>
        </div>
    );
}
