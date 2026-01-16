"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Sparkles,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navbar */}
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

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-900 bg-opacity-50 border border-blue-700 rounded-full text-blue-300 text-sm font-semibold flex items-center space-x-2">
              <Sparkles size={16} />
              <span>Powered by AI</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 leading-tight">
            Get Your Resume Match Score Instantly
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            TailorAI analyzes your resume against job postings, identifies
            missing keywords and skills, and provides actionable suggestions to
            help you land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              //   onClick={() => openAuthModal('signup')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition flex items-center space-x-2 text-lg"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
            <button className="px-8 py-3 border-2 border-slate-600 text-white rounded-lg font-semibold hover:border-blue-500 hover:text-blue-400 transition text-lg">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition hover:bg-opacity-60">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Target className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-400">
              Advanced algorithms scan and compare your resume with job
              requirements in seconds
            </p>
          </div>

          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition hover:bg-opacity-60">
            <div className="w-12 h-12 bg-cyan-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-cyan-400 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Match Score</h3>
            <p className="text-gray-400">
              Get a clear percentage score showing how well your profile matches
              the job
            </p>
          </div>

          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition hover:bg-opacity-60">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
            <p className="text-gray-400">
              Receive personalized recommendations to improve your resume and
              boost your chances
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="benefits"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How TailorAI Works
          </h2>
          <p className="text-xl text-gray-400">
            Three simple steps to optimize your resume
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700 rounded-lg p-8">
              <div className="text-5xl font-bold text-blue-400 mb-4">01</div>
              <h3 className="text-2xl font-bold mb-4">Upload Your Resume</h3>
              <p className="text-gray-400">
                Paste your resume and the job posting you're interested in. No
                file uploads needed—just plain text.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-700 rounded-lg p-8">
              <div className="text-5xl font-bold text-cyan-400 mb-4">02</div>
              <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
              <p className="text-gray-400">
                Our advanced AI analyzes keywords, skills, and experience level
                to calculate your match percentage.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-700 rounded-lg p-8">
              <div className="text-5xl font-bold text-purple-400 mb-4">03</div>
              <h3 className="text-2xl font-bold mb-4">Get Recommendations</h3>
              <p className="text-gray-400">
                Receive detailed insights on missing skills, keywords to add,
                and improvements to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to succeed in your job search
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Instant Match Score</h3>
                <p className="text-gray-400">
                  See exactly how well your resume matches the job posting in
                  percentage terms
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-cyan-500 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="text-cyan-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Missing Keywords</h3>
                <p className="text-gray-400">
                  Identify specific keywords and phrases you should add to your
                  resume
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-purple-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Skill Gap Analysis</h3>
                <p className="text-gray-400">
                  Discover which skills are in demand and prioritize your
                  learning goals
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-800 bg-opacity-40 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-pink-500 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="text-pink-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Personalized Tips</h3>
                <p className="text-gray-400">
                  Get actionable recommendations tailored to each specific job
                  opportunity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of job seekers who've improved their match scores
            with TailorAI
          </p>
          <button
            // onClick={() => openAuthModal('signup')}
            className="px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-700 bg-slate-900 bg-opacity-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="border-t border-slate-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TailorAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
