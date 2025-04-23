'use client';
import { AudioLines, SendHorizontal, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import advisorimg from "@/assets/Advisor.svg"

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "You are CareerLink—your go-to senior for career advice. Stay focused on career development, jobs, skills, and growth. Be chill, clear, and practical, using simple English. If a question isn't directly related to career advice, such as personal opinions, general knowledge, abstract queries, or ethical debates, respond: 'I'm here for career advice! Ask about jobs or career growth.' Avoid discussing your own identity or giving speculative answers. Stick to practical, actionable guidance for career advancement. This is the user's prompt -> " + input }),
      });

      const data = await response.json();
      console.log(data);
      const botReply = data.choices?.[0]?.message?.content || 'Error: No response received';

      setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col justify-end items-center h-screen bg-black text-white p-4">
      <div className="w-full max-w-3xl flex flex-col space-y-2 overflow-y-auto h-[65vh] p-2 no-scrollbar">
        {
          messages.length == 0 &&
          <div className='w-full h-full flex items-center justify-center'>
            <Image src={advisorimg} alt='d' />
          </div>
        }
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
         <div className='bg-[#171717] rounded-lg px-4 pt-4 pb-2 w-full max-w-3xl'>
           <div className='flex items-center justify-between space-x-2 mb-2'>
             <input
              type="text"
              className="flex-1 bg-[#171717] text-white outline-none w-full max-w-3xl px-2"
              placeholder="Chat with AI Career Advisor..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
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
      <p className='text-sm font-light mt-2'>AI suggestions may not be perfect. Please verify before use.</p>
    </div>
  );
}

