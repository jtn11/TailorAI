import { useAuth } from "@/context/authcontext";
import { LogOut, Menu, Zap } from "lucide-react";

interface Navbar {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const Navbar = ({ setSidebarOpen, sidebarOpen }: Navbar) => {

  const {logout} = useAuth(); 
  const handleLogout = () => {
    logout();
  }

  return (
    <header className="bg-slate-800 bg-opacity-50 backdrop-blur border-b border-slate-700">
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              TailorAI
            </h1>
          </div>
        </div>
        <button 
        onClick={handleLogout}
        className="hidden md:flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
