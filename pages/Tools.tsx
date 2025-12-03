import React from 'react';
import { Terminal, PenTool, Gift, Code, Zap, Search } from 'lucide-react';
import { ToolItem } from '../types';
import Reveal from '../components/Reveal';

const tools: ToolItem[] = [
  // Free Tools
  { title: 'Notion', description: 'All-in-one workspace for notes and tasks.', category: 'Free Tools', icon: <Gift /> },
  { title: 'Canva', description: 'Free design tool for everyone.', category: 'Free Tools', icon: <PenTool /> },
  { title: 'Trello', description: 'Kanban-style project management.', category: 'Free Tools', icon: <Zap /> },
  
  // AI Tools
  { title: 'ChatGPT', description: 'Advanced AI conversational model.', category: 'AI Tools', icon: <Search /> },
  { title: 'GitHub Copilot', description: 'AI pair programmer.', category: 'AI Tools', icon: <Code /> },
  { title: 'Midjourney', description: 'Generative AI for images.', category: 'AI Tools', icon: <PenTool /> },
  
  // Developer Tools
  { title: 'VS Code', description: 'Code editor redefined.', category: 'Developer Tools', icon: <Terminal /> },
  { title: 'Postman', description: 'API development and testing.', category: 'Developer Tools', icon: <Zap /> },
  { title: 'Vercel', description: 'Develop. Preview. Ship.', category: 'Developer Tools', icon: <Code /> },
];

const Tools: React.FC = () => {
  const categories = ['Free Tools', 'AI Tools', 'Developer Tools'];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <Reveal>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Tools That Make Life Easier</h1>
            <p className="text-lg text-slate-600">WhatNew gathers the most effective and trusted tools in one place.</p>
          </Reveal>
        </div>

        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-8 w-1 bg-primary-500 rounded-full"></div>
                   <h2 className="text-2xl font-bold text-slate-800">{category}</h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter(t => t.category === category).map((tool, index) => (
                  <Reveal key={index} delay={index * 100}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          {tool.icon}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{tool.title}</h3>
                      </div>
                      <p className="text-slate-600">{tool.description}</p>
                      <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
                          Learn more &rarr;
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Tools;