"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Users,
  Zap,
  Target,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  BookOpen,
  Trophy,
  Sparkles,
  UserPlus,
  Play,
} from "lucide-react";
import { Button, Card } from "@/components/ui";

const features = [
  {
    icon: Zap,
    title: "Interactive Visualizations",
    description:
      "Watch algorithms execute step-by-step with beautiful animations",
  },
  {
    icon: Code2,
    title: "Multi-Language Support",
    description: "Learn in Python, JavaScript, Java, or C++ - your choice",
  },
  {
    icon: Target,
    title: "Structured Learning Paths",
    description: "Progress from basics to advanced concepts systematically",
  },
  {
    icon: Trophy,
    title: "Gamified Experience",
    description: "Earn points, badges, and track your progress",
  },
];

const stats = [
  { value: "15+", label: "Algorithms", color: "from-blue-600 to-cyan-600" },
  { value: "300+", label: "Quiz Questions", color: "from-purple-600 to-pink-600" },
  { value: "130+", label: "Practice Problems", color: "from-green-600 to-emerald-600" },
  { value: "5", label: "Languages", color: "from-orange-600 to-red-600" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              About AlgoBuddy
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Making{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Algorithms
              </span>{" "}
              Fun to Learn
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              AlgoBuddy is an interactive platform designed to help developers
              master data structures and algorithms through visual learning,
              hands-on practice, and gamified progression.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/learn">
                <Button>
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/visualize">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Visualizations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-purple-50/0 group-hover:from-violet-50 group-hover:to-purple-50 dark:group-hover:from-violet-900/20 dark:group-hover:to-purple-900/20 rounded-2xl transition-all duration-300"></div>
                <div className="relative text-center">
                  <div className={`text-5xl md:text-6xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-sm font-bold mb-8 shadow-lg"
            >
              <Heart className="w-5 h-5 fill-current" />
              Our Mission
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-slate-900 dark:text-white leading-tight"
            >
              Democratizing{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                DSA Education
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
            >
              We believe that understanding data structures and algorithms
              shouldn't be a barrier to becoming a great developer. Our mission
              is to provide a <span className="text-violet-600 dark:text-violet-400 font-bold">free, visual, and engaging</span> way to learn these
              fundamental concepts. Whether you're preparing for interviews or
              simply curious about how things work, AlgoBuddy is here to help.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Why Choose AlgoBuddy
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">
              What Makes Us{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Different
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We've combined the best learning techniques with modern technology to create an unparalleled learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = [
                'from-violet-500 to-purple-600',
                'from-blue-500 to-cyan-600',
                'from-green-500 to-emerald-600',
                'from-orange-500 to-amber-600',
              ];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-violet-300 dark:hover:border-violet-600">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold mb-8">
              <Trophy className="w-5 h-5" />
              Join the Community
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl lg:text-2xl text-white/95 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Join thousands of developers mastering algorithms through interactive visualizations,
              hands-on practice, and AI-powered assistance. Start learning today with <span className="font-bold underline decoration-2">free access</span>!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/auth/signup">
                <Button
                  className="group inline-flex items-center gap-3 px-10 py-6 bg-white text-violet-600 hover:bg-slate-50 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="w-6 h-6" />
                  Create Free Account
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/visualizer">
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-3 px-10 py-6 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                >
                  <Play className="w-6 h-6" />
                  Try Without Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Get in Touch
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Have questions, suggestions, or want to contribute? We'd love to
              hear from you!
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Twitter className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </a>
              <a
                href="mailto:hello@algobuddy.dev"
                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
