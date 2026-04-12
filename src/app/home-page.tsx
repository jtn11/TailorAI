"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  FileText,
  Briefcase,
  Search,
  PenTool,
  Trophy,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { LandingPageNavbar } from "./landing-page-components/navbar";

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  function getStarted() {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  }

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 overflow-hidden font-sans relative selection:bg-blue-500/30">
      
      {/* Background Ambient Effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
      <div className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDelay: "4s" }}></div>

      <LandingPageNavbar
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32 md:pt-40 md:pb-40 flex flex-col lg:flex-row items-center gap-16 z-10">
        <div className="flex-1 text-center lg:text-left z-20">
          <div className="inline-block mb-6">
            <div className="px-4 py-2 bg-blue-900/40 border border-blue-500/30 rounded-full text-cyan-300 text-sm font-bold flex items-center space-x-2 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Sparkles size={16} className="text-cyan-400" />
              <span>Next-Gen Career Co-Pilot</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold mb-8 tracking-tight text-white leading-[1.1]">
            Hack the <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400">
              Job Market.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Upload your resume and the job description. Our AI instantly scores your profile, writes perfectly tailored cover letters, and finds relevant active jobs on the web.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <button
              onClick={getStarted}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 border border-blue-400/50 transform hover:-translate-y-1 text-lg group"
            >
              <span>Start Analyzing Free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md border border-slate-600 text-white rounded-xl font-bold transition-all text-lg hover:border-slate-400">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Abstract Floating UI Hero Graphic */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none hidden md:block">
          {/* Main Card */}
          <div className="relative z-20 bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-semibold text-sm tracking-wider uppercase">Match Analysis</span>
              <div className="h-3 w-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></div>
            </div>
            <div className="flex items-end gap-4 mb-8">
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">92%</div>
              <div className="text-xl text-slate-300 font-medium pb-2">Perfect Fit</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3"><CheckCircle className="text-emerald-400" size={18} /><span className="text-slate-200 font-medium">React & Next.js</span></div>
                <span className="text-xs text-slate-500 uppercase font-black">Found</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3"><CheckCircle className="text-emerald-400" size={18} /><span className="text-slate-200 font-medium">Tailwind CSS</span></div>
                <span className="text-xs text-slate-500 uppercase font-black">Found</span>
              </div>
            </div>
          </div>

          {/* Floating Element 1 - Job Match */}
          <div className="absolute -bottom-10 -left-16 z-30 bg-slate-800/90 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl shadow-blue-900/20 transform hover:-translate-y-2 transition-transform duration-500 animate-in slide-in-from-bottom flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Briefcase className="text-blue-400" size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Senior Frontend Role</div>
              <div className="text-xs text-blue-300 font-medium">14 Active Matches Found</div>
            </div>
          </div>

          {/* Floating Element 2 - Cover Letter */}
          <div className="absolute top-10 -right-12 z-30 bg-[#0f172a]/95 backdrop-blur-xl border border-purple-500/30 p-5 rounded-2xl shadow-xl shadow-purple-900/20 transform hover:-translate-y-2 transition-transform duration-500 animate-in slide-in-from-right flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FileText className="text-purple-400" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Cover Letter Ready</div>
              <div className="text-xs text-purple-300 font-medium">Exported to PDF</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 z-10" id="features">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-white tracking-tight">The Ultimate Arsenal</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Equip yourself with four distinct AI-driven tools designed to eliminate the friction from your job hunt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Main Feature - Resume Analysis */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/80 rounded-3xl p-10 flex flex-col justify-between group hover:border-blue-500/50 transition-colors relative overflow-hidden backdrop-blur-sm">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6">
                <Target className="text-blue-400 w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Deep Resume Analysis</h3>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                Paste your resume and the target job description. We perform semantic matching to instantly highlight missing keywords, skills, and overall fit score.
              </p>
            </div>
          </div>

          {/* Feature - Cover Letters */}
          <div className="md:col-span-1 bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/80 rounded-3xl p-10 flex flex-col justify-between group hover:border-purple-500/50 transition-colors relative overflow-hidden backdrop-blur-sm">
            <div className="absolute right-0 top-0 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px] group-hover:bg-purple-600/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-6">
                <PenTool className="text-purple-400 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Auto Cover Letters</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Generates a highly personalized, compelling cover letter based on your exact missing skills bridging the gap perfectly. Export instantly to PDF.
              </p>
            </div>
          </div>

          {/* Feature - Smart Job Matching */}
          <div className="md:col-span-2 bg-gradient-to-br from-cyan-900/40 to-slate-900 border border-cyan-800/50 rounded-3xl p-10 flex flex-col justify-between group hover:border-cyan-500/50 transition-colors relative overflow-hidden backdrop-blur-sm">
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] group-hover:bg-cyan-600/20 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between h-full gap-8">
               <div>
                  <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-6">
                    <Search className="text-cyan-400 w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Smart Web Job Matching</h3>
                  <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                    Once optimized, our <span className="font-bold text-cyan-200">jSearch Integration</span> scans the web for live job openings that perfectly match your newly tuned profile. Apply with high confidence.
                  </p>
               </div>
               
               {/* Mini visual */}
               <div className="hidden lg:flex flex-col gap-3 w-64">
                 <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex justify-between items-center"><span className="text-xs font-bold text-slate-300">Frontend Dev</span><span className="text-xs text-cyan-400 font-bold">95% Match</span></div>
                 <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex justify-between items-center opacity-70"><span className="text-xs font-bold text-slate-300">Software Eng.</span><span className="text-xs text-emerald-400 font-bold">88% Match</span></div>
                 <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex justify-between items-center opacity-40"><span className="text-xs font-bold text-slate-300">React Lead</span><span className="text-xs text-blue-400 font-bold">81% Match</span></div>
               </div>
            </div>
          </div>

          {/* Feature - Gap Analysis */}
          <div className="md:col-span-1 bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/80 rounded-3xl p-10 flex flex-col justify-between group hover:border-emerald-500/50 transition-colors relative overflow-hidden backdrop-blur-sm">
             <div className="absolute left-0 top-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-[60px] group-hover:bg-emerald-600/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="text-emerald-400 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Actionable Insights</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Detailed gap analysis showing exactly what you need to study, learn, or highlight before your interview.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works / Pipeline Section */}
      <section className="relative px-6 lg:px-8 py-32 bg-slate-900/50 backdrop-blur-sm border-y border-slate-800/80 z-10">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-white tracking-tight">The TailorAI Pipeline</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">From raw resume to endless job offers in three fluid steps.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 relative">
               {/* Connecting Line Desktop */}
               <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-900/50 via-cyan-900/50 to-purple-900/50 rounded-full z-0"></div>

               {/* Step 1 */}
               <div className="flex flex-col items-center text-center relative z-10 max-w-sm">
                  <div className="w-24 h-24 bg-slate-900 border-2 border-blue-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-8 transform -rotate-3 transition-transform hover:rotate-0">
                     <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Input Data</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Paste your raw text resume and any job description. No complex formatting required.</p>
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center text-center relative z-10 max-w-sm">
                  <div className="w-24 h-24 bg-slate-900 border-2 border-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-8 transform transition-transform hover:scale-105">
                     <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-teal-300">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">AI Processing</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Our engine extracts keywords, analyzes gaps, calculates matching scores, and generates your custom cover letter.</p>
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center text-center relative z-10 max-w-sm">
                  <div className="w-24 h-24 bg-slate-900 border-2 border-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-8 transform rotate-3 transition-transform hover:rotate-0">
                     <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-300">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Hunt & Apply</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">View perfectly matched live jobs instantly scraped from the web, and apply with your optimized assets.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Modern Premium CTA Footer */}
      <section className="relative px-6 lg:px-8 py-32 z-10 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
           <div className="absolute bottom-[-20%] left-1/2 transform -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-blue-900/40 to-transparent blur-[120px] pointer-events-none"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-20">
          <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
              Ready to land your <br className="hidden md:block"/> dream position?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-slate-400 max-w-3xl mx-auto font-medium">
              Join the thousands of candidates bypassing ATS filters and securing interviews with tailored applications.
            </p>
            <button
              onClick={getStarted}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-xl hover:from-blue-500 hover:to-cyan-400 transition-all shadow-[0_0_40px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 group-hover:scale-105 flex items-center justify-center space-x-3 mx-auto"
            >
              <span>Get Started Now</span>
              <ChevronRight size={24} />
            </button>
            <p className="text-sm font-semibold text-slate-500 mt-6 uppercase tracking-widest">Free to start • No credit card required</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-500 py-8 text-center text-sm font-medium z-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <p>&copy; 2026 TailorAI. All rights reserved. Crafted for the modern job market.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
