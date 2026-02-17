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
    <div className="min-h-screen py-12">
      <div className="container px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about AlgoBuddy. Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 overflow-x-auto"
        >
          <div className="flex gap-2 pb-2">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Icon className="w-4 h-4" />
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
            <div className="text-center py-12 bg-card border rounded-xl">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try a different search term or browse all categories
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-card border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform",
                      expandedItems.has(faq.id) && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {expandedItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-muted-foreground">
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
          className="mt-12 bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
          </p>
          <Link href="/contact">
            <Button className="gap-2">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
