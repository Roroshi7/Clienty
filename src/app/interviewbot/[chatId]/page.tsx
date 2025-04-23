'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Upload, AudioLines, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import advisorimg from "@/assets/Advisor.svg";
import { useMyContext } from '@/context/MyContext';
import { useParams } from "next/navigation";

type Message = {
    text: string;
    sender: 'user' | 'bot';
};

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function Interviewbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [jobRole, setJobRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const { userProfile } = useMyContext();
    const params = useParams();
    const chatId = params.chatId as string;

    useEffect(() => {
        fetchChatHistory();
    }, [chatId, userProfile]);
    
    useEffect(() => {
        if (jobRole && jobDescription && messages.length === 0 && !loading) {
            startInterview();
        }
    }, [jobRole, jobDescription, messages, loading]);
    
    const fetchChatHistory = async () => {
        if (userProfile?.UserId) {
            try {
                const userId = userProfile?.UserId;
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/chat/${userId}/${chatId}`);
                const chatData = await response.json();
                console.log("Chatdata", chatData);
                setMessages(chatData.chat || []);
                setJobRole(chatData.jobRole || "");
                setJobDescription(chatData.jobDescription || "");
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        } else {
            return;
        }
    };

    const updateChatInDB = async (newMessages: Message[]) => {
        if (userProfile?.UserId) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/chat/${userProfile.UserId}/${chatId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updatedChat: { chat: newMessages } }),
                });
                const chatData = await response.json();
                console.log(chatData)

                if (!response.ok) {
                    console.error("Failed to update chat in database");
                }
            } catch (error) {
                console.error("Error updating chat:", error);
            }
        }
    };

    const fetchGeminiResponse = async (requestBody: object): Promise<string> => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        let rawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
        rawResponse = rawResponse
            .replace(/\*\*Feedback:\*\*/g, "Feedback:")
            .replace(/\*\*Next Question:\*\*/g, "Next Question:");
        return rawResponse;
    };

    const getStartInterviewBody = () => ({
        contents: [
            {
                parts: [{
                    text: `You are an AI interviewer conducting a structured job interview. Job Role: ${jobRole}, Job Description: ${jobDescription}. This is the start of the interview. Ask the first relevant question based on the job role and description to begin the conversation effectively. ` 
                }],
            },
        ],
    });

    const getUserAnswerBody = (chatHistory: Message[]) => {
        const chatString = chatHistory
            .map((msg) => `${msg.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`)
            .join("\n");

        return {
            contents: [
                {
                    parts: [{
                        text: `You are an AI interviewer conducting a structured job interview.  
                        Job Role: ${jobRole}  
                        Job Description: ${jobDescription}  

                        Below is the full chat history of the interview so far:  
                        ${chatString}  

                        Analyze the candidate's latest answer, provide brief constructive feedback (mention strengths and areas for improvement), and ask the next relevant question that hasn’t been asked before.  
                        Format the response like this:  
                        Feedback: [Feedback here]  
                        Next Question: [Next relevant interview question]`
                    }],
                },
            ],
        };
    };

    // const getFinalFeedbackBody = (chatHistory: Message[]) => {
    //     const chatString = chatHistory
    //         .map((msg) => `${msg.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`)
    //         .join("\n");

    //     return {
    //         contents: [
    //             {
    //                 parts: [{
    //                     text: `You are an AI interviewer conducting a structured job interview.  
    //                     Job Role: ${jobRole}  
    //                     Job Description: ${jobDescription}  

    //                     Below is the full chat history of the completed interview:  
    //                     ${chatString}  

    //                     Provide comprehensive feedback on the candidate’s overall performance throughout the interview. Highlight key strengths, areas for improvement, and any specific advice for excelling in the given job role.  
    //                     Format the response like this:  
    //                     Final Feedback: [Comprehensive feedback here]`
    //                 }],
    //             },
    //         ],
    //     };
    // };

    const startInterview = async () => {
        setLoading(true);
        try {
            const initialQuestion = await fetchGeminiResponse(getStartInterviewBody());
            console.log("Start interview",initialQuestion)
            console.log("Start question",initialQuestion)
            const botMessage: Message = { text: initialQuestion, sender: 'bot' };
            setMessages([botMessage]);
            await updateChatInDB([botMessage]);
        } catch (error) {
            console.error('Error starting interview:', error);
            setMessages([{ text: "Error starting interview. Please try again.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        await updateChatInDB([userMessage]);

        try {
            const botReply = await fetchGeminiResponse(getUserAnswerBody([...messages, userMessage]));
            console.log("send message",getUserAnswerBody([...messages, userMessage]));
            const botMessage: Message = { text: botReply, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
            await updateChatInDB([botMessage]);
        } catch (error) {
            console.error('Error fetching Gemini response:', error);
            setMessages((prev) => [...prev, { text: "Error fetching response.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    // const endInterview = async () => {
    //     setLoading(true);
    //     try {
    //         const finalFeedback = await fetchGeminiResponse(getFinalFeedbackBody(messages));
    //         const botMessage: Message = { text: finalFeedback, sender: 'bot' };
    //         setMessages((prev) => [...prev, botMessage]);
    //         await updateChatInDB([botMessage]);
    //     } catch (error) {
    //         console.error('Error fetching final feedback:', error);
    //         setMessages((prev) => [...prev, { text: "Error generating final feedback.", sender: 'bot' }]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log(messages)
    }, [messages]);

    return (
        <div className="flex flex-col justify-end items-center h-full w-full max-w-6xl text-white p-4 pb-2">
            <div className="w-full max-w-3xl flex flex-col space-y-2 overflow-y-auto h-[65vh] p-2 no-scrollbar">
                {messages.length === 0 && !loading && (
                    <div className="w-full h-full flex items-center justify-center">
                        <Image src={advisorimg} alt="AI Advisor" />
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'user' ? 'bg-[#7d47ea]/70' : 'bg-gray-700'}`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg max-w-md bg-gray-700 flex items-center space-x-2">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="w-full max-w-3xl flex items-center space-x-2 mt-4">
                <div className="bg-[#171717] rounded-lg px-4 pt-4 pb-2 w-full max-w-3xl">
                    <div className="flex items-center justify-between space-x-2 mb-2">
                        <input
                            type="text"
                            className="flex-1 bg-[#171717] text-white outline-none w-full max-w-3xl px-2"
                            placeholder="Type your answer..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            disabled={loading || messages.length === 0}
                        />
                        <button onClick={sendMessage} className="bg-[#7d47ea] p-2 font-semibold min-w-max rounded-full
              hover:scale-105
              active:bg-[radial-gradient(72.97%_270%_at_50%_50%,_rgb(150,100,250)_0%,_rgb(90,20,220)_85%)]
              active:shadow-[rgba(150,100,250,0.75)_0px_2px_10px_0px,_rgb(150,100,250)_0px_1px_1px_0px_inset] 
              active:scale-95"
                            disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <SendHorizontal />}
                        </button>
                    </div>
                    <div className='flex items-center justify-between w-full'>
                        <button className='p-2 rounded-full border hover:scale-105 hover:bg-gray-700'><Upload /></button>
                        <button className='p-2 rounded-full hover:scale-110'><AudioLines /></button>
                    </div>
                </div>
            </div>
            <p className='text-sm font-light mt-2'>AI-generated responses may need review.</p>
        </div>
    );
}