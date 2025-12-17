import React from 'react';
import { Briefcase, MapPin, DollarSign, PlusCircle, Code, Server, PenTool, ChevronRight, TrendingUp, Megaphone, Headphones, Heart, Wifi, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

interface JobPosting {
  title: string;
  skills: string;
  location: string;
  type: string;
  salary: string;
  icon: React.ReactNode;
}

const jobs: JobPosting[] = [
  {
    title: 'Frontend Developer',
    skills: 'React & JS required',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹6-8 LPA',
    icon: <Code size={24} />,
  },
  {
    title: 'Backend Developer',
    skills: 'Node.js & MongoDB',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹7-10 LPA',
    icon: <Server size={24} />,
  },
  {
    title: 'UI/UX Designer',
    skills: 'Figma & Adobe XD',
    location: 'Chennai',
    type: 'Part-time',
    salary: '₹3-5 LPA',
    icon: <PenTool size={24} />,
  },
  {
    title: 'Data Analyst',
    skills: 'Python, SQL & Tableau',
    location: 'Hyderabad',
    type: 'Full-time',
    salary: '₹5-7 LPA',
    icon: <TrendingUp size={24} />,
  },
  {
    title: 'Marketing Manager',
    skills: 'Digital Marketing & SEO',
    location: 'Mumbai',
    type: 'Full-time',
    salary: '₹8-12 LPA',
    icon: <Megaphone size={24} />,
  },
  {
    title: 'Customer Support Lead',
    skills: 'Communication & CRM',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹4-6 LPA',
    icon: <Headphones size={24} />,
  }
];

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80" alt="Office" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6">
              <Briefcase size={14} fill="currentColor" /> We're Hiring
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Join Our Team</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We are looking for talented individuals to help us build the future of live commerce.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20 -mt-10">

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {jobs.map((job, index) => (
            <Reveal key={index} delay={index * 100}>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:border-primary-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {job.icon}
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                    {job.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                <p className="text-slate-600 mb-6 flex-grow">{job.skills}</p>

                <div className="space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPin size={16} className="mr-2 text-primary-500" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <DollarSign size={16} className="mr-2 text-primary-500" />
                    {job.salary}
                  </div>
                </div>

                <button className="mt-6 w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                  Apply Now
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Company Benefits Section */}
        <div className="mt-20 mb-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Work With Us?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">We believe in taking care of our team with great perks and benefits.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal delay={100}>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center group">
                <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Health Insurance</h3>
                <p className="text-slate-500 text-sm">Comprehensive medical coverage for you and your family.</p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center group">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Wifi size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Remote Work</h3>
                <p className="text-slate-500 text-sm">Flexible work-from-home options with home office stipend.</p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center group">
                <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Learning Budget</h3>
                <p className="text-slate-500 text-sm">₹50,000/year for courses, books, and conferences.</p>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center group">
                <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Award size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Stock Options</h3>
                <p className="text-slate-500 text-sm">Equity participation for all full-time employees.</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Post a New Job Section */}
        <Reveal>
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white text-center shadow-xl relative overflow-hidden group">
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
              alt="Office background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-slate-900/80"></div>

            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <PlusCircle size={32} className="text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Post a New Job</h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                Are you an employer looking for top tech talent? Partner with WhatNew to find the perfect candidate for your team.
              </p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary-900/50">
                Create Job Listing
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default Careers;
