import { Menu, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  setMobileMenuOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
}

export const LandingPageNavbar = ({
  setMobileMenuOpen,
  mobileMenuOpen,
}: NavbarProps) => {
  const router = useRouter();
  return (
    <nav className=" bg-opacity-30 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              TailorAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              About
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => router.push("/signin")}
              className="px-6 py-2 text-white hover:text-blue-400 transition font-medium"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition font-medium"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-slate-700 pt-4">
            <a
              href="#features"
              className="block text-gray-300 hover:text-white transition font-medium"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block text-gray-300 hover:text-white transition font-medium"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="block text-gray-300 hover:text-white transition font-medium"
            >
              About
            </a>
            <div className="flex flex-col space-y-2 pt-4 border-t border-slate-700">
              <button
                onClick={() => router.push("/signin")}
                className="w-full px-4 py-2 text-white hover:text-blue-400 transition font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
