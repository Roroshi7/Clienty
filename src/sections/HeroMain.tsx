"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Cover } from "@/components/ui/cover";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import linear from "@/assets/linear.webp"
import { RoboAnimation } from "@/components/robo-animation";
import { FloatingPaper } from "@/components/floating-paper";
import { SparklesCore } from "@/components/sparkles2";


export default function HeroMain() {
    return (
        <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 relative z-20 overflow-hidden">
            <div className="mt-[12vh]"></div>
            <div className="h-full w-full absolute inset-0 z-0">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <div className="absolute inset-0 overflow-hidden -z-30">
                <FloatingPaper count={3} />
            </div>
            <AnimatedGradientText>
                ✨ <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
                <span
                    className={cn(
                        `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                    )}
                >
                    Introducing CareerLink
                </span>
            </AnimatedGradientText>
            <div className="relative z-20 mx-auto my-6 text-center text-3xl font-semibold tracking-tight text-neutral-300 md:text-6xl">
                <p>Craft Your Future with</p>
                <div className="mt-2 md:mt-8"><Cover className="py-2">AI-Optimized Resumes</Cover></div>
            </div>

            <div className="absolute top-80 right-0 w-96 h-96">
                <RoboAnimation />
            </div>
            <div className="flex flex-col overflow-hidden">
                <ContainerScroll>
                    <div className="w-full h-full flex flex-col bg-white text-black p-8 overflow-auto">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <h1 className="text-3xl font-bold">John Doe</h1>
                                <p className="text-gray-600">Software Engineer</p>
                            </div>
                            <div className="text-right text-sm">
                                <p>john.doe@example.com</p>
                                <p>(555) 123-4567</p>
                                <p>San Francisco, CA</p>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold border-b pb-2">Professional Summary</h2>
                            <p className="mt-2 text-gray-700">
                                Experienced software engineer with a strong background in full-stack development, 
                                specializing in React, Node.js, and cloud technologies. Passionate about creating 
                                scalable solutions and leading technical teams.
                            </p>
                        </div>
                        
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold border-b pb-2">Experience</h2>
                            <div className="mt-2">
                                <div className="mb-4">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">Senior Software Engineer</h3>
                                        <p className="text-gray-600">2020 - Present</p>
                                    </div>
                                    <p className="text-gray-600">TechCorp Inc.</p>
                                    <ul className="list-disc ml-5 mt-1 text-gray-700">
                                        <li>Led development of microservices architecture</li>
                                        <li>Improved application performance by 40%</li>
                                        <li>Mentored junior developers</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold border-b pb-2">Skills</h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="bg-gray-200 px-3 py-1 rounded">JavaScript</span>
                                <span className="bg-gray-200 px-3 py-1 rounded">React</span>
                                <span className="bg-gray-200 px-3 py-1 rounded">Node.js</span>
                                <span className="bg-gray-200 px-3 py-1 rounded">TypeScript</span>
                                <span className="bg-gray-200 px-3 py-1 rounded">AWS</span>
                                <span className="bg-gray-200 px-3 py-1 rounded">Docker</span>
                            </div>
                        </div>
                    </div>
                </ContainerScroll>
            </div>
        </div>
    );
}