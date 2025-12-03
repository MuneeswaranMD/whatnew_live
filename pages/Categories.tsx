import React from 'react';
import { Cpu, Code, Smartphone, BookOpen, Megaphone, CheckSquare, Star, Shield, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const categoryList = [
  { name: 'Technology', icon: <Cpu />, color: 'bg-blue-100 text-blue-600' },
  { name: 'Artificial Intelligence', icon: <Star />, color: 'bg-purple-100 text-purple-600' },
  { name: 'Programming', icon: <Code />, color: 'bg-slate-100 text-slate-600' },
  { name: 'Android & Mobile', icon: <Smartphone />, color: 'bg-green-100 text-green-600' },
  { name: 'Online Learning', icon: <BookOpen />, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Marketing', icon: <Megaphone />, color: 'bg-red-100 text-red-600' },
  { name: 'Productivity', icon: <CheckSquare />, color: 'bg-teal-100 text-teal-600' },
  { name: 'Cyber Awareness', icon: <Shield />, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Digital Life', icon: <Wifi />, color: 'bg-pink-100 text-pink-600' },
];

const Categories: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
            <h1 className="text-4xl font-bold text-center text-slate-900 mb-12">Browse by Topic</h1>
        </Reveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map((cat, idx) => (
            <Reveal key={idx} delay={idx * 50}>
                <Link 
                  to="/blog"
                  className="flex items-center p-6 rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group bg-slate-50 hover:bg-white"
                >
                  <div className={`p-4 rounded-full mr-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <span className="text-lg font-semibold text-slate-800 group-hover:text-primary-600">{cat.name}</span>
                </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;