'use client';

import avatar1 from "@/assets/avatars/avatar-1.png";
import avatar2 from "@/assets/avatars/avatar-2.png";
import avatar3 from "@/assets/avatars/avatar-3.png";
import avatar4 from "@/assets/avatars/avatar-4.png";
import avatar5 from "@/assets/avatars/avatar-5.png";
import avatar6 from "@/assets/avatars/avatar-6.png";
import avatar7 from "@/assets/avatars/avatar-7.png";
import avatar8 from "@/assets/avatars/avatar-8.png";
import avatar9 from "@/assets/avatars/avatar-9.png";
import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
    {
        text: "CareerLink's smart tools gave me clear direction and confidence in my career choices.",
        imageSrc: avatar1.src,
        name: "Olivia Carter",
        username: "@oliviacareerpath",
    },
    {
        text: "The AI-powered roadmap simplified my learning journey, making upskilling easy and effective.",
        imageSrc: avatar2.src,
        name: "Michael Turner",
        username: "@michael_upskill",
    },
    {
        text: "CareerLink helped me create a stunning resume with zero effort.",
        imageSrc: avatar3.src,
        name: "Sophia Bennett",
        username: "@sophiadesignhub",
    },
    {
        text: "Mock interviews with AI interview prep boosted my confidence and refined my responses.",
        imageSrc: avatar4.src,
        name: "Liam Brooks",
        username: "@liam_jobseeker",
    },
    {
        text: "With AI guidance, I built a career plan that aligns perfectly with my long-term goals.",
        imageSrc: avatar5.src,
        name: "Isabella Kim",
        username: "@isabellacareer",
    },
    {
        text: "CareerLink's personalized advice and insights helped me land my dream job faster.",
        imageSrc: avatar6.src,
        name: "Ethan Davis",
        username: "@ethandaviswork",
    },
    {
        text: "The platform's AI-powered mentorship gave me a structured learning approach for success.",
        imageSrc: avatar7.src,
        name: "Chloe Patel",
        username: "@chloementorship",
    },
    {
        text: "From career planning to resume building, CareerLink made everything effortless.",
        imageSrc: avatar8.src,
        name: "Aiden Scott",
        username: "@aidenscottpath",
    },
    {
        text: "The AI interview prep chatbot simulated real questions, making my job interviews easier.",
        imageSrc: avatar9.src,
        name: "Emma Harper",
        username: "@emmaharperprep",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: { className?: string; testimonials: typeof testimonials; duration?: number }) => (
    <div className={props.className}>
        <motion.div className="flex flex-col gap-6 py-6"
            animate={{
                translateY: "-50%"
            }}
            transition={{
                duration: props.duration || 10,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
            }}
        >
            {[...new Array(2)].fill(0).map((_, index) => (
                <div key={index}>
                    {props.testimonials.map(({ text, imageSrc, name, username }, testimonialIndex) => (
                        <div key={testimonialIndex} className="card mt-5">
                            <div>{text}</div>
                            <div className="flex items-center gap-2 mt-5">
                                <Image src={imageSrc} alt={name} width={40} height={40} className="h-10 w-10 rounded-full" />
                                <div className="flex flex-col">
                                    <div className="font-medium tracking-tight leading-5">{name}</div>
                                    <div className="leading-5 tracking-tight">{username}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </motion.div>
    </div>
);

export const Testimonials = () => {
    return (
        <section className="bg-[#0A0A0A] mt-12 px-4 sm:px-8 lg:px-10">
            <h2 className="text-4xl md:text-6xl font-bold text-center mx-auto tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 h-full py-4">
                What Our Users Say
            </h2>
            <p className="max-w-lg text-sm text-center mx-auto mt-4 text-neutral-300">
                See how CareerLink has transformed career journeys with AI-powered guidance, smart roadmaps, and effortless resume building. Hear from users who have taken their careers to the next level!
            </p>
            <div className="flex justify-center gap-16 mt-10 max-h-[738px] overflow-hidden px-4 sm:px-8 lg:px-10">
                <TestimonialsColumn testimonials={firstColumn} duration={15} />
                <TestimonialsColumn testimonials={secondColumn} className="hidden sm:flex" duration={19} />
                <TestimonialsColumn testimonials={thirdColumn} className="hidden md:flex" duration={17} />
            </div>
        </section>
    );
};