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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8 shadow-sm">
              <Zap className="w-4 h-4 text-blue-600" />
              Interactive DSA Learning Platform
            </div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-slate-900 px-4">
              Master{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Data Structures
              </span>
              <br />
              and{" "}
              <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                Algorithms
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
              Watch algorithms execute step-by-step with interactive visualizations.
              Practice with 300+ quiz questions, 130+ LeetCode problems, and AI-powered
              learning assistance. Master DSA with hands-on experience.
            </p>

            {/* Auth Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-6 sm:mb-8 px-4">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <UserPlus className="w-5 h-5" />
                Create New Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/auth/signin"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-semibold text-base sm:text-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
            </div>

            <p className="text-sm text-slate-500">
              Join thousands of learners mastering DSA
            </p>
          </div>

          {/* Preview mockup */}
          <div className="mt-16 lg:mt-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-200 to-cyan-200 rounded-3xl opacity-20 blur-3xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm font-medium text-slate-600">
                  Bubble Sort Visualization
                </span>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 bg-gradient-to-br from-slate-50 to-blue-50/30">
                {/* Visualization area */}
                <div className="flex-1 flex items-end justify-center gap-1 sm:gap-2 h-32 sm:h-40 lg:h-48">
                  {[64, 34, 25, 12, 22, 11, 90].map((value, i) => (
                    <div
                      key={i}
                      className={`w-8 sm:w-10 lg:w-12 rounded-t-lg transition-all duration-300 shadow-lg ${
                        i < 2
                          ? "bg-gradient-to-t from-green-500 to-green-400"
                          : i < 4
                          ? "bg-gradient-to-t from-blue-500 to-blue-400"
                          : "bg-gradient-to-t from-cyan-500 to-blue-400"
                      }`}
                      style={{ height: `${(value / 90) * 100}%` }}
                    />
                  ))}
                </div>
                {/* Code panel */}
                <div className="flex-1 bg-white rounded-xl p-3 sm:p-4 lg:p-5 font-mono text-xs sm:text-sm shadow-xl border-2 border-slate-200 overflow-x-auto">
                  <div className="text-slate-500">{"// Bubble Sort"}</div>
                  <div className="text-purple-600">
                    {"for"}{" "}
                    <span className="text-slate-900">i</span>{" "}
                    <span className="text-purple-600">in</span>{" "}
                    <span className="text-blue-600">range</span>
                    <span className="text-slate-900">(n):</span>
                  </div>
                  <div className="text-purple-600 pl-4 bg-purple-50 rounded py-0.5">
                    {"for"}{" "}
                    <span className="text-slate-900">j</span>{" "}
                    <span className="text-purple-600">in</span>{" "}
                    <span className="text-blue-600">range</span>
                    <span className="text-slate-900">(n-i-1):</span>
                  </div>
                  <div className="text-purple-600 pl-8">
                    {"if"}{" "}
                    <span className="text-slate-900">arr[j] {">"} arr[j+1]:</span>
                  </div>
                  <div className="text-slate-900 pl-12">
                    arr[j], arr[j+1] = arr[j+1], arr[j]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Structures Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Explore Data Structures
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Interactive visualizations for all major data structures with
              operations you can see and understand.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dataStructures.map((ds) => {
              const Icon = ds.icon;
              return (
                <Link
                  key={ds.name}
                  href={`/visualizer?ds=${ds.name.toLowerCase().replace(" ", "-")}`}
                  className="group relative p-6 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${ds.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    {ds.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Everything You Need to Learn DSA
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A complete platform designed to make learning algorithms
              intuitive, interactive, and fun.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-violet-500 to-fuchsia-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Master Algorithms?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of developers learning DSA the visual way. Start your
            journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/visualizer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white border-2 border-white/30 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-white/20 hover:border-white/50"
            >
              <Play className="w-5 h-5" />
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-slate-600 font-medium">Algorithms</div>
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-purple-600 mb-2">6</div>
              <div className="text-slate-600 font-medium">Data Structures</div>
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-green-600 mb-2">130+</div>
              <div className="text-slate-600 font-medium">Practice Problems</div>
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-orange-600 mb-2">4</div>
              <div className="text-slate-600 font-medium">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">Quick Links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/quiz"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Daily Quiz</div>
                <div className="text-sm text-slate-600">Test Knowledge</div>
              </div>
            </Link>
            <Link
              href="/flashcards"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Flashcards</div>
                <div className="text-sm text-slate-600">Quick Review</div>
              </div>
            </Link>
            <Link
              href="/speed-coding"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Speed Coding</div>
                <div className="text-sm text-slate-600">Beat the Clock</div>
              </div>
            </Link>
            <Link
              href="/practice"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">LeetCode Practice</div>
                <div className="text-sm text-slate-600">130+ Curated Problems</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
