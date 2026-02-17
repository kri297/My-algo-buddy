'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Code2,
  Zap,
  BookOpen,
  Trophy,
  GitBranch,
  Layers,
  Binary,
  TreeDeciduous,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Play,
    title: "Interactive Visualizations",
    description:
      "Watch algorithms come to life with step-by-step animations. Control speed, pause, and step through each operation.",
  },
  {
    icon: Code2,
    title: "Multi-Language Code",
    description:
      "See implementations in Python, JavaScript, Java, and C++. Code highlights sync with visualizations in real-time.",
  },
  {
    icon: Zap,
    title: "Instant Complexity Analysis",
    description:
      "Understand time and space complexity with live operation counts and performance comparisons.",
  },
  {
    icon: BookOpen,
    title: "Structured Learning Paths",
    description:
      "20+ comprehensive lessons across arrays, trees, graphs, and DP. Complete with explanations and examples.",
  },
  {
    icon: Trophy,
    title: "300+ Quiz Questions",
    description:
      "Test your knowledge with 32 quiz modules covering all major DSA topics. Earn XP and track your progress.",
  },
  {
    icon: GitBranch,
    title: "Time-Travel Debugging",
    description:
      "Step backward through any operation. Set breakpoints and explore 'what-if' scenarios.",
  },
];

const dataStructures = [
  { name: "Arrays", icon: Layers, color: "from-cyan-500 to-blue-500" },
  { name: "Linked Lists", icon: GitBranch, color: "from-green-500 to-emerald-500" },
  { name: "Trees", icon: TreeDeciduous, color: "from-amber-500 to-orange-500" },
  { name: "Graphs", icon: GitBranch, color: "from-cyan-500 to-blue-500" },
  { name: "Stacks & Queues", icon: Layers, color: "from-red-500 to-rose-500" },
  { name: "Heaps", icon: Binary, color: "from-teal-500 to-cyan-500" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-30" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 backdrop-blur-sm text-blue-700 dark:text-blue-300 text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Interactive DSA Learning Platform
              </span>
            </div>

            {/* Enhanced Heading with Better Gradients */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 sm:mb-8 text-slate-900 px-4 leading-tight">
              Master{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent animate-gradient">
                  Data Structures
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full opacity-30"></span>
              </span>
              <br />
              <span className="text-slate-600">and</span>{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Algorithms
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full opacity-30"></span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4 font-medium">
              Watch algorithms execute <span className="text-blue-600 font-bold">step-by-step</span> with interactive visualizations.
              Practice with <span className="text-purple-600 font-bold">300+ quiz questions</span>, <span className="text-pink-600 font-bold">130+ LeetCode problems</span>, and 
              <span className="text-green-600 font-bold"> AI-powered</span> learning assistance.
            </p>

            {/* Enhanced Auth Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center mb-8 sm:mb-10 px-4">
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <UserPlus className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Create Free Account</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/auth/signin"
                className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white text-slate-800 border-3 border-slate-300 rounded-2xl font-bold text-base sm:text-lg hover:border-blue-600 hover:text-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <LogIn className="w-6 h-6" />
                <span>Sign In</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Free Forever</span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Gamified Learning</span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">5 Languages</span>
              </div>
            </div>
          </div>

          {/* Enhanced Preview Mockup */}
          <div className="mt-20 lg:mt-24 relative px-4">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-3xl opacity-30 blur-3xl animate-pulse" />
            <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-slate-200/50 overflow-hidden backdrop-blur-sm">
              {/* Browser Chrome */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer" />
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Play className="w-4 h-4 text-green-600" />
                  <span>Bubble Sort Visualization</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Running</span>
                </div>
                <div className="w-16"></div>
              </div>
              
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
                {/* Visualization area */}
                <div className="flex-1 bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Array Visualization</span>
                    <span className="text-xs font-mono text-slate-500">O(n²)</span>
                  </div>
                  <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-40 sm:h-48 lg:h-56">
                    {[64, 34, 25, 12, 22, 11, 90].map((value, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 sm:w-12 lg:w-14 rounded-t-xl transition-all duration-500 shadow-lg hover:scale-105 ${
                            i < 2
                              ? "bg-gradient-to-t from-green-600 via-green-500 to-green-400 shadow-green-500/50"
                              : i < 4
                              ? "bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 shadow-blue-500/50"
                              : "bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400 shadow-purple-500/50"
                          }`}
                          style={{ height: `${(value / 90) * 100}%` }}
                        />
                        <span className="text-xs font-bold text-slate-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Code panel */}
                <div className="flex-1 bg-slate-900 rounded-2xl p-5 sm:p-6 lg:p-7 font-mono text-sm sm:text-base shadow-2xl border border-slate-700 overflow-x-auto">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Python</span>
                  </div>
                  <div className="text-slate-500 mb-2">{"# Bubble Sort Algorithm"}</div>
                  <div className="text-pink-400">
                    {"for"}{" "}
                    <span className="text-blue-300">i</span>{" "}
                    <span className="text-pink-400">in</span>{" "}
                    <span className="text-yellow-300">range</span>
                    <span className="text-slate-300">(n):</span>
                  </div>
                  <div className="text-pink-400 pl-4 bg-slate-800/50 rounded-lg py-2 my-1">
                    {"for"}{" "}
                    <span className="text-blue-300">j</span>{" "}
                    <span className="text-pink-400">in</span>{" "}
                    <span className="text-yellow-300">range</span>
                    <span className="text-slate-300">(n-i-1):</span>
                  </div>
                  <div className="text-pink-400 pl-8">
                    {"if"}{" "}
                    <span className="text-slate-300">arr[j] {">"} arr[j+1]:</span>
                  </div>
                  <div className="text-slate-300 pl-12 bg-green-500/10 rounded-lg py-2 my-1 border-l-2 border-green-500">
                    arr[j], arr[j+1] = arr[j+1], arr[j]
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-700 flex items-center gap-4 text-xs text-slate-400">
                    <span>Comparisons: <span className="text-blue-400 font-bold">21</span></span>
                    <span>Swaps: <span className="text-green-400 font-bold">15</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Structures Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
              <Layers className="w-4 h-4" />
              Interactive Visualizations
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900">
              Explore{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Data Structures
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Interactive visualizations for all major data structures. See every operation in action.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {dataStructures.map((ds) => {
              const Icon = ds.icon;
              return (
                <Link
                  key={ds.name}
                  href={`/visualizer?ds=${ds.name.toLowerCase().replace(" ", "-")}`}
                  className="group relative p-6 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ds.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                      {ds.name}
                    </h3>
                    <div className="mt-3 flex items-center text-xs text-slate-500 group-hover:text-blue-600 transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200 text-violet-700 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Excel at DSA
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A complete learning ecosystem designed to take you from beginner to interview-ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = [
                'from-violet-500 to-purple-600',
                'from-blue-500 to-cyan-600',
                'from-green-500 to-emerald-600',
                'from-orange-500 to-red-600',
                'from-pink-500 to-rose-600',
                'from-indigo-500 to-blue-600',
              ];
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 hover:border-violet-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-purple-50/0 group-hover:from-violet-50 group-hover:to-purple-50 rounded-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-violet-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8">
            <Trophy className="w-4 h-4" />
            Start Your Journey Today
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            Ready to Master Algorithms?
          </h2>
          <p className="text-xl lg:text-2xl text-white/95 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Join thousands of developers learning DSA the visual way. Start your
            journey today with <span className="font-bold underline decoration-2 decoration-white/50">free  access</span> to all features.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-violet-600 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 shadow-xl hover:scale-105"
            >
              <UserPlus className="w-6 h-6" />
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/visualizer"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-2xl"
            >
              <Play className="w-6 h-6" />
              Try Live Demo
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-semibold">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-semibold">Always Free Tier</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-semibold">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="relative group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">15+</div>
                <div className="text-slate-700 font-bold text-lg">Algorithms</div>
                <div className="text-xs text-slate-500 mt-1">Fully visualized</div>
              </div>
            </div>
            
            <div className="relative group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">6</div>
                <div className="text-slate-700 font-bold text-lg">Data Structures</div>
                <div className="text-xs text-slate-500 mt-1">Interactive demos</div>
              </div>
            </div>
            
            <div className="relative group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/10 group-hover:to-green-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-transparent mb-3">130+</div>
                <div className="text-slate-700 font-bold text-lg">Practice Problems</div>
                <div className="text-xs text-slate-500 mt-1">LeetCode curated</div>
              </div>
            </div>
            
            <div className="relative group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/10 group-hover:to-orange-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-orange-600 to-orange-800 bg-clip-text text-transparent mb-3">5</div>
                <div className="text-slate-700 font-bold text-lg">Languages</div>
                <div className="text-xs text-slate-500 mt-1">C, JS, Python, Java, C++</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Quick Access</span> to All Features
            </h2>
            <p className="text-lg text-slate-600">Jump right into learning with our most popular tools</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/quiz"
              className="group flex items-center gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">Daily Quiz</div>
                <div className="text-sm text-slate-600">Test Your Knowledge</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link
              href="/flashcards"
              className="group flex items-center gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Flashcards</div>
                <div className="text-sm text-slate-600">Quick Review</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link
              href="/speed-coding"
              className="group flex items-center gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">Speed Coding</div>
                <div className="text-sm text-slate-600">Beat the Clock</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link
              href="/practice"
              className="group flex items-center gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-slate-900 group-hover:text-green-600 transition-colors">LeetCode Practice</div>
                <div className="text-sm text-slate-600">130+ Curated Problems</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
