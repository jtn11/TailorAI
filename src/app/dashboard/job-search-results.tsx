"use client";
import { ArrowLeft, Building2, ExternalLink, MapPin, Briefcase } from "lucide-react";

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
  match_score: number;
}

// Mock data for UI design purposes
const MOCK_JOBS: Job[] = [
  {
    job_id: "1",
    job_title: "Senior React Developer",
    employer_name: "TechNova Solutions",
    job_city: "San Francisco",
    job_state: "CA",
    job_country: "US",
    job_is_remote: true,
    job_employment_type: "FULLTIME",
    job_description: "We are looking for an experienced React developer to lead our frontend architecture. Must have strong skills in Next.js, TailwindCSS, and state management.",
    job_apply_link: "#",
    job_posted_at_datetime_utc: "2024-04-09T10:00:00.000Z",
    match_score: 92,
  },
  {
    job_id: "2",
    job_title: "Full Stack Engineer",
    employer_name: "Global Innovations",
    job_city: "New York",
    job_state: "NY",
    job_country: "US",
    job_is_remote: false,
    job_employment_type: "FULLTIME",
    job_description: "Join our dynamic team to build scalable web applications. Experience with React, Node.js, and PostgreSQL is required.",
    job_apply_link: "#",
    job_posted_at_datetime_utc: "2024-04-08T14:30:00.000Z",
    match_score: 85,
  },
  {
    job_id: "3",
    job_title: "Frontend Developer (UI/UX focus)",
    employer_name: "Creative Studio",
    job_city: "London",
    job_state: null,
    job_country: "UK",
    job_is_remote: true,
    job_employment_type: "CONTRACT",
    job_description: "Looking for a detail-oriented frontend developer who has a keen eye for design. Experience with Figma, basic CSS animations, and React.",
    job_apply_link: "#",
    job_posted_at_datetime_utc: "2024-04-10T09:15:00.000Z",
    match_score: 78,
  },
];

interface Props {
  onBack: () => void;
}

export const JobSearchResults = ({ onBack }: Props) => {
  // In the future, this component will fetch from jSearch API
  // const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  // const [loading, setLoading] = useState(false);
  const jobs = MOCK_JOBS;

  const formatLocation = (job: Job) => {
    if (job.job_is_remote) return "Remote";
    const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
    return parts.join(", ") || "Location not specified";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
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
            <span>Tailored Job Matches</span>
          </h2>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-slate-800/40 px-4 py-2 rounded-full border border-slate-700/50 self-start md:self-auto">
          Showing <span className="text-white font-bold">{jobs.length}</span> positions matching your profile
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-5">
        {jobs.map((job) => (
          <div
            key={job.job_id}
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
                {/* Mobile only score */}
                <span className="md:hidden text-emerald-400 font-bold text-sm bg-blue-900/20 px-2 py-0.5 rounded border border-blue-800/30 flex items-baseline space-x-0.5">
                  <span>{job.match_score}</span><span className="text-[10px] text-slate-400">/100</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300 font-medium">
                <span className="flex items-center space-x-1.5 whitespace-nowrap"><Building2 size={14} className="text-blue-400" /><span>{job.employer_name}</span></span>
                <span className="hidden md:inline text-slate-700 font-black">•</span>
                <span className="flex items-center space-x-1.5 whitespace-nowrap"><MapPin size={14} className="text-sky-400" /><span>{formatLocation(job)}</span></span>
                <span className="hidden md:inline text-slate-700 font-black">•</span>
                <span className="flex items-center space-x-1.5 whitespace-nowrap"><Briefcase size={14} className="text-purple-400" /><span className="capitalize">{job.job_employment_type.toLowerCase()}</span></span>
                <span className="hidden md:inline text-slate-700 font-black">•</span>
                <span className="text-slate-500 text-xs whitespace-nowrap">{formatTime(job.job_posted_at_datetime_utc)}</span>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 w-full md:w-11/12 pt-1">
                {job.job_description}
              </p>
            </div>

            {/* Right: Score & Apply */}
            <div className="flex w-full md:w-auto items-center justify-between md:flex-col md:items-end gap-3 md:gap-4 pl-0 md:pl-5 md:border-l border-slate-800/80 relative z-10 h-full min-h-[80px]">
              {/* Desktop Score */}
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Match Score</span>
                <div className="text-emerald-400 font-bold flex items-baseline space-x-1 mt-0.5">
                  <span className="text-xl leading-none">{job.match_score}</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>
              
              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-900/30 w-full md:w-auto whitespace-nowrap mt-auto"
              >
                <span>Apply Now</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
