'use client';

import { motion } from 'framer-motion';

const roles = [
  'Frontend', 'Backend', 'DevOps', 'Full Stack', 'AI Engineer', 
  'Data Analyst', 'AI and Data Scientist', 'Android', 'iOS', 'PostgreSQL', 
  'Blockchain', 'QA', 'Software Architect', 'Cyber Security', 'UX Design', 
  'Game Developer', 'Technical Writer', 'MLOps', 'Product Manager', 
  'Engineering Manager', 'Developer Relations', 'DSA', "Prompt Engineering"
];

const roleLinks: Record<string, string> = {
  'Frontend': 'https://roadmap.sh/pdfs/roadmaps/frontend.pdf',
  'Backend':'https://roadmap.sh/pdfs/roadmaps/backend.pdf',
  'DevOps': 'https://roadmap.sh/pdfs/roadmaps/devops.pdf' ,
  'Full Stack': 'https://roadmap.sh/pdfs/roadmaps/full-stack.pdf' ,
  'AI Engineer' : 'https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf' ,
  'Data Analyst' : 'https://roadmap.sh/pdfs/roadmaps/data-analyst.pdf' ,
  'AI and Data Scientist' : 'https://roadmap.sh/pdfs/roadmaps/ai-data-scientist.pdf',
  'Android': 'https://roadmap.sh/pdfs/roadmaps/android.pdf' ,
  'iOS' : 'https://roadmap.sh/pdfs/roadmaps/ios.pdf' , 
  'PostgreSQL': 'https://roadmap.sh/pdfs/roadmaps/postgresql-dba.pdf' ,
  'Blockchain' : 'https://roadmap.sh/pdfs/roadmaps/blockchain.pdf' ,
  'QA' : 'https://roadmap.sh/pdfs/roadmaps/qa.pdf' ,
  'Software Architect' : 'https://roadmap.sh/pdfs/roadmaps/software-architect.pdf' ,
  'Cyber Security' : 'https://roadmap.sh/pdfs/roadmaps/cyber-security.pdf' ,
  'UX Design': 'https://roadmap.sh/pdfs/roadmaps/ux-design.pdf' ,
  'Game Developer' : 'https://roadmap.sh/pdfs/roadmaps/game-developer.pdf' ,
  'Technical Writer' : 'https://roadmap.sh/pdfs/roadmaps/technical-writer.pdf' ,
  'MLOps' : 'https://roadmap.sh/pdfs/roadmaps/mlops.pdf' ,
  'Product Manager' : 'https://roadmap.sh/pdfs/roadmaps/product-manager.pdf' ,
  'Engineering Manager' : 'https://roadmap.sh/pdfs/roadmaps/engineering-manager.pdf' ,
  'Developer Relations' : 'https://roadmap.sh/pdfs/roadmaps/devrel.pdf' ,
  'DSA' : 'https://roadmap.sh/pdfs/roadmaps/datastructures-and-algorithms.pdf' ,
  'Prompt Engineering' : 'https://roadmap.sh/pdfs/roadmaps/prompt-engineering.pdf' ,
};

export default function Hero() {

  const handleRoleClick = (role: string) => {
    const url = roleLinks[role] || 'https://docs.google.com/default';
    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Role-based Roadmaps</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {roles.map((role) => (
          <motion.button
            key={role}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-16 w-full border-2 hover:border-none rounded-lg flex items-center justify-between px-4 font-semibold cursor-pointer transition-all hover:bg-[#7d47ea]"
            onClick={() => handleRoleClick(role)}
          >
            {role}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
