"use client";
import { useAuth } from "@/context/authcontext";
import { Bell, HelpCircle, LogOut, Menu, Search } from "lucide-react";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const Navbar = ({ setSidebarOpen, sidebarOpen }: NavbarProps) => {
  const { logout } = useAuth();

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

      {/* Center: Search bar */}
      <div className="flex-1 max-w-xs hidden sm:flex">
        <div className="flex items-center gap-2 bg-[#0f1829] border border-[#1a2d4a] rounded-md px-3 py-1.5 w-full">
          <Search size={14} className="text-[#4a6080] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="bg-transparent text-[#94a3b8] placeholder-[#4a6080] text-sm outline-none w-full"
          />
        </div>
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
        <a
          href="#"
          className="text-sm text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
        >
          Applications
        </a>
      </nav>

      {/* Right: icons + logout */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto md:ml-0">
        <button
          className="text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          className="text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>
        {/* Avatar placeholder */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563eb] to-[#4edea3] flex items-center justify-center text-xs font-bold text-white select-none">
          U
        </div>
        <button
          onClick={logout}
          className="hidden md:flex items-center gap-1.5 text-sm text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
