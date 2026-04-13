"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Building2, ExternalLink, MapPin, Briefcase, Search, Loader2 } from "lucide-react";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string | null;
  job_state: string | null;
  job_country: string | null;
  job_is_remote: boolean;
  job_employment_type: string;
  job_description: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
}

interface Props {
  onBack: () => void;
  initialQuery?: string;
}

export const JobSearchResults = ({ onBack, initialQuery = "" }: Props) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // The actively fetched full query string
  const [activeQuery, setActiveQuery] = useState<string>(initialQuery || "Developer");
  
  // Form input states
  const [searchRole, setSearchRole] = useState<string>(initialQuery || "Developer");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [isRemote, setIsRemote] = useState<boolean>(false);

  useEffect(() => {
    fetchJobs(activeQuery);
  }, [activeQuery]);

  const fetchJobs = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch jobs");
      }

      setJobs(result.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const compileQuery = () => {
    let q = searchRole.trim() || "Developer";
    if (searchLocation.trim()) {
      q += ` in ${searchLocation.trim()}`;
    }
    if (isRemote) {
      q += " remote";
    }
    return q;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(compileQuery());
  };

  const formatLocation = (job: Job) => {
    if (job.job_is_remote) return "Remote";
    const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
    return parts.join(", ") || "Location not specified";
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const diffTime = Math.ceil((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffTime === 0) return "Today";
    if (diffTime === 1) return "Yesterday";
    return `${diffTime} days ago`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-5">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition font-medium text-sm bg-slate-800/80 hover:bg-slate-700 py-2 px-4 rounded-lg border border-slate-700/50"
          >
            <ArrowLeft size={16} />
            <span>Back to Analysis</span>
          </button>
          <div className="hidden md:block h-6 w-px bg-slate-700"></div>
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2.5">
            <Briefcase size={20} className="text-blue-400" />
            <span>Live Job Matches</span>
          </h2>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col gap-3 w-full md:w-[28rem]">
          <div className="flex flex-col sm:flex-row shadow-inner bg-[#0b1221] border border-slate-700 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
            {/* What */}
            <div className="flex-1 relative flex items-center border-b sm:border-b-0 sm:border-r border-slate-700">
              <Search size={16} className="absolute left-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                placeholder="Job title, skills..."
                className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none"
              />
            </div>
            
            {/* Where */}
            <div className="flex-1 relative flex items-center">
              <MapPin size={16} className="absolute left-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City, state, or country"
                className="w-full bg-transparent py-2.5 pl-10 pr-12 text-sm text-white focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="absolute right-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded p-1.5 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} 
              </button>
            </div>
          </div>
          
          {/* Remote Toggle */}
          <label className="flex items-center space-x-2 text-sm text-slate-400 cursor-pointer self-end md:self-start group">
            <input 
              type="checkbox" 
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span className="group-hover:text-slate-300 transition-colors">Remote positions only</span>
          </label>
        </form>
      </div>

      <div className="pb-4 border-b border-slate-800 flex justify-between items-end">
         <p className="text-sm font-medium text-slate-400">
           {loading ? "Searching active listings..." : `Found ${jobs.length} open positions for "${activeQuery}"`}
         </p>
      </div>

      {/* Results List */}
      <div className="space-y-5">
        {error && (
           <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
              <span>{error}</span>
           </div>
        )}

        {loading ? (
             <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5 animate-pulse flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-4">
                            <div className="h-6 w-1/3 bg-slate-700/50 rounded"></div>
                            <div className="flex gap-3">
                                <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                                <div className="h-4 w-16 bg-slate-700/50 rounded"></div>
                            </div>
                            <div className="h-10 w-full bg-slate-700/30 rounded mt-2"></div>
                        </div>
                        <div className="w-full md:w-32 flex flex-col justify-end">
                            <div className="h-10 w-full bg-slate-700/50 rounded-lg"></div>
                        </div>
                    </div>
                ))}
             </div>
        ) : jobs.length === 0 && !error ? (
           <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-xl">
             <Briefcase size={48} className="mx-auto text-slate-600 mb-4" />
             <h3 className="text-xl font-bold text-slate-300">No jobs found</h3>
             <p className="text-slate-500 mt-2">Try adjusting your search keywords or location.</p>
           </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.job_id || Math.random().toString()}
              className="bg-[#0b1221] border border-slate-700/60 rounded-xl p-5 hover:border-blue-500/40 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-blue-900/10 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 relative overflow-hidden"
            >
              {/* Subtle generic background glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 -mr-16 -mt-16 pointer-events-none"></div>

              {/* Left: Job Details */}
              <div className="flex-1 w-full space-y-2.5 relative z-10">
                <div className="flex items-center justify-between md:justify-start gap-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {job.job_title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300 font-medium pb-1">
                  <span className="flex items-center space-x-1.5 whitespace-nowrap"><Building2 size={14} className="text-blue-400" /><span>{job.employer_name || "Confidential"}</span></span>
                  <span className="hidden md:inline text-slate-700 font-black">•</span>
                  <span className="flex items-center space-x-1.5 whitespace-nowrap"><MapPin size={14} className="text-sky-400" /><span>{formatLocation(job)}</span></span>
                  
                  {job.job_employment_type && (
                     <>
                        <span className="hidden md:inline text-slate-700 font-black">•</span>
                        <span className="flex items-center space-x-1.5 whitespace-nowrap"><Briefcase size={14} className="text-purple-400" /><span className="capitalize">{job.job_employment_type.toLowerCase()}</span></span>
                     </>
                  )}
                  <span className="hidden md:inline text-slate-700 font-black">•</span>
                  <span className="text-slate-500 text-xs whitespace-nowrap">{formatTime(job.job_posted_at_datetime_utc)}</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 w-full md:w-11/12">
                  {job.job_description ? job.job_description.substring(0, 300) : "No description provided."}...
                </p>
              </div>

              {/* Right: Apply */}
              <div className="flex w-full md:w-auto items-center justify-end md:flex-col md:items-end gap-3 md:gap-4 pl-0 md:pl-5 md:border-l border-slate-800/80 relative z-10 h-full md:min-h-[80px]">
                <a
                  href={job.job_apply_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-900/30 w-full md:w-auto whitespace-nowrap mt-auto"
                >
                  <span>Apply Now</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
