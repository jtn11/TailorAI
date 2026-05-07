"use client";
import { Menu, Plus } from "lucide-react";
interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  handleReset: () => void;
}

export const Navbar = ({ setSidebarOpen, sidebarOpen, handleReset }: NavbarProps) => {

  return (
    <header
      style={{ fontFamily: "'Inter', 'Space Grotesk', sans-serif" }}
      className="h-14 bg-[#0b1221]/98 backdrop-blur-md border-b border-[#1a2d4a] flex items-center px-5 gap-4"
    >
      {/* Left: Hamburger + Brand */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="text-[#b4c5ff] font-bold text-lg tracking-tight select-none">
          TailorAI
        </span>
      </div>

      {/* Nav links (center-right) */}
      <nav className="hidden md:flex items-center gap-6 ml-auto mr-4">
        <a
          href="#"
          className="text-sm text-[#b4c5ff] font-medium border-b border-[#b4c5ff] pb-0.5 transition-colors hover:text-white"
        >
          Resume Analysis
        </a>
        <a
          href="#"
          className="text-sm text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
        >
          Job Matches
        </a>
        
      </nav>

      {/* Right: icons + logout */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto md:ml-0">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all text-sm font-semibold"
          title="New Analysis"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Analysis</span>
        </button>
        
        {/* Avatar placeholder */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563eb] to-[#4edea3] flex items-center justify-center text-xs font-bold text-white select-none">
          U
        </div>
      </div>
    </header>
  );
};
