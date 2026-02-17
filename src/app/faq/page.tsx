"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ChevronDown, 
  Search,
  BookOpen,
  Code2,
  Settings,
  CreditCard,
  Users,
  Shield,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Input, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  { id: "all", label: "All", icon: HelpCircle },
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "features", label: "Features", icon: Code2 },
  { id: "account", label: "Account", icon: Settings },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "community", label: "Community", icon: Users },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "what-is-algobuddy",
    question: "What is AlgoBuddy?",
    answer: "AlgoBuddy is an interactive platform designed to help developers master data structures and algorithms. We provide visual explanations, hands-on coding practice, step-by-step tutorials, and gamified learning paths to make DSA learning engaging and effective.",
    category: "getting-started",
  },
  {
    id: "who-is-it-for",
    question: "Who is AlgoBuddy for?",
    answer: "AlgoBuddy is perfect for: beginners learning programming fundamentals, students preparing for coding interviews, developers wanting to strengthen their algorithmic thinking, and anyone curious about how algorithms work visually.",
    category: "getting-started",
  },
  {
    id: "prerequisites",
    question: "What are the prerequisites to use AlgoBuddy?",
    answer: "Basic programming knowledge in any language (Python, JavaScript, Java, or C++) is recommended. We assume familiarity with variables, loops, and functions. Our beginner modules are designed to be accessible even if you're new to programming.",
    category: "getting-started",
  },
  {
    id: "how-to-start",
    question: "How do I get started with learning?",
    answer: "Start by exploring our Learning Paths section. We recommend beginning with 'Arrays & Strings' for absolute beginners, or take our placement quiz to get personalized recommendations based on your current skill level.",
    category: "getting-started",
  },

  // Features
  {
    id: "visualizations",
    question: "How do the algorithm visualizations work?",
    answer: "Our visualizations show each step of an algorithm's execution in real-time. You can control the animation speed, pause at any point, step through manually, and see the corresponding code highlighted. This helps you understand exactly what's happening at each step.",
    category: "features",
  },
  {
    id: "playground",
    question: "What is the Playground feature?",
    answer: "The Playground is an interactive code editor where you can write, test, and visualize your own algorithm implementations. JavaScript code runs directly in your browser, while Python code can be copied to run locally or in an online interpreter.",
    category: "features",
  },
  {
    id: "simulators",
    question: "What are Data Structure Simulators?",
    answer: "Our simulators let you interact with data structures like arrays, stacks, queues, linked lists, trees, and graphs. You can perform operations (insert, delete, search) and see the visual changes in real-time, helping you understand how each data structure works internally.",
    category: "features",
  },
  {
    id: "progress-tracking",
    question: "How does progress tracking work?",
    answer: "AlgoBuddy tracks your completed lessons, solved challenges, earned achievements, and learning streaks. You can view your progress on the Dashboard, see skill levels for different topics, and get recommendations for what to learn next.",
    category: "features",
  },
  {
    id: "languages",
    question: "What programming languages are supported?",
    answer: "We support C, Python, JavaScript, Java, and C++. All algorithm explanations and code examples are available in all five languages. You can switch between languages at any time in the settings or on individual lesson pages.",
    category: "features",
  },

  // Account
  {
    id: "create-account",
    question: "Do I need an account to use AlgoBuddy?",
    answer: "You can explore most features without an account, but creating one unlocks progress tracking, achievements, personalized recommendations, and the ability to save your code. Sign up is free and only takes a minute!",
    category: "account",
  },
  {
    id: "sync-progress",
    question: "Is my progress synced across devices?",
    answer: "Yes! When you're signed in, your progress, settings, and achievements are synced to your account and accessible from any device. Just sign in with the same account to continue where you left off.",
    category: "account",
  },
  {
    id: "delete-account",
    question: "How do I delete my account?",
    answer: "You can delete your account from the Settings page under 'Account Settings'. This will permanently remove all your data, progress, and achievements. If you just want to take a break, consider signing out instead.",
    category: "account",
  },

  // Pricing
  {
    id: "is-free",
    question: "Is AlgoBuddy free to use?",
    answer: "Yes! AlgoBuddy offers a generous free tier that includes access to all learning modules, visualizations, and basic challenges. We believe quality education should be accessible to everyone.",
    category: "pricing",
  },
  {
    id: "premium-features",
    question: "What additional features does Premium offer?",
    answer: "Premium unlocks advanced challenges, interview preparation mode, unlimited playground saves, priority support, certificate of completion, and access to our private Discord community with mentors.",
    category: "pricing",
  },
  {
    id: "student-discount",
    question: "Do you offer student discounts?",
    answer: "Yes! Students with a valid .edu email address get 50% off Premium. We also offer special pricing for educational institutions and coding bootcamps. Contact us for details.",
    category: "pricing",
  },

  // Community
  {
    id: "community-features",
    question: "Is there a community I can join?",
    answer: "Absolutely! We have a Discord server where learners discuss problems, share solutions, and help each other. Premium members get access to exclusive channels with mentors and weekly Q&A sessions.",
    category: "community",
  },
  {
    id: "contribute",
    question: "Can I contribute to AlgoBuddy?",
    answer: "We love contributions! You can suggest new features, report bugs, or contribute content. Visit our GitHub repository or reach out through the Contact page. Active contributors may be eligible for free Premium access.",
    category: "community",
  },

  // Privacy & Security
  {
    id: "data-privacy",
    question: "How is my data protected?",
    answer: "We take privacy seriously. Your data is encrypted at rest and in transit. We never sell your personal information to third parties. See our Privacy Policy for complete details on data handling.",
    category: "privacy",
  },
  {
    id: "cookies",
    question: "What cookies does AlgoBuddy use?",
    answer: "We use essential cookies for authentication and preferences, analytics cookies to improve our service (can be disabled), and no advertising cookies. You can manage cookie preferences in Settings.",
    category: "privacy",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="container px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about AlgoBuddy. Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-violet-600 dark:text-violet-400 hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-16 pr-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-lg focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-lg hover:shadow-xl"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 overflow-x-auto"
        >
          <div className="flex gap-3 pb-3">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-semibold border-2",
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-600 shadow-lg scale-105"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 hover:scale-105 hover:shadow-md"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-slate-400 dark:text-slate-600" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No results found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Try a different search term or browse all categories
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-8 py-4 rounded-xl font-semibold"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-600"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between p-6 lg:p-7 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="font-bold text-lg pr-6 text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 text-slate-400 flex-shrink-0 transition-all duration-300 group-hover:text-violet-600",
                      expandedItems.has(faq.id) && "rotate-180 text-violet-600"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {expandedItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 lg:px-7 pb-6 lg:pb-7 text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </motion.div>

        {/* Still need help? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative rounded-3xl p-10 lg:p-14 text-center shadow-2xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold mb-6">
              <MessageSquare className="w-4 h-4" />
              Need More Help?
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 text-white">Still have questions?</h2>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
              Can&apos;t find the answer you&apos;re looking for? Our team is here to help you succeed.
            </p>
            <Link href="/contact">
              <Button className="gap-3 px-10 py-6 bg-white text-violet-600 hover:bg-slate-50 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all duration-300">
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
