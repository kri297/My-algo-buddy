"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store";
import { ChatbotModal } from "@/components/ChatbotModal";
import {
  Home,
  BookOpen,
  Code2,
  BarChart3,
  Settings,
  User,
  Trophy,
  Menu,
  X,
  Moon,
  Sun,
  Laptop,
  Brain,
  Eye,
  Boxes,
  MessageCircle,
  Layers,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/visualizer", label: "Visualizer", icon: Eye },
  { href: "/practice", label: "Practice", icon: Code2 },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "#", label: "Notes", icon: BookOpen, external: true, externalUrl: "https://drive.google.com/file/d/1YwWIlETYmGHXiDAzIIE_Xiz0H0EoFurH/view?usp=sharing" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const { settings, updateSettings } = useSettingsStore();

  const cycleTheme = () => {
    const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSettings({ theme: themes[nextIndex] });
  };

  const ThemeIcon = settings.theme === "light" ? Sun : settings.theme === "dark" ? Moon : Laptop;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-400/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Algo</span>
            <span className="text-slate-900">Buddy</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isExternal = (item as any).external;
            const externalUrl = (item as any).externalUrl;
            
            if (isExternal && externalUrl) {
              return (
                <a
                  key={item.href}
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              );
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 text-sm font-medium"
            title="AI Assistant"
          >
            <MessageCircle className="w-4 h-4" />
            <span>AI Assistant</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </button>

          <Link
            href="/profile"
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:flex text-slate-700"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden text-slate-700"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 p-4 space-y-2 bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isExternal = (item as any).external;
            const externalUrl = (item as any).externalUrl;
            
            if (isExternal && externalUrl) {
              return (
                <a
                  key={item.href}
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              );
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t pt-2 mt-2">
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </div>
        </nav>
      )}

      {/* Chatbot Modal */}
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </header>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t-2 border-slate-200 py-12 mt-auto bg-gradient-to-b from-white to-slate-50">
      <div className="container px-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">AlgoBuddy</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Master algorithms and data structures with interactive visualizations.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Learn</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/learn" className="text-slate-600 hover:text-blue-600 transition-colors">Learning Path</Link></li>
              <li><Link href="/visualizer" className="text-slate-600 hover:text-blue-600 transition-colors">Visualizations</Link></li>
              <li><Link href="/flashcards" className="text-slate-600 hover:text-blue-600 transition-colors">Flashcards</Link></li>
            </ul>
          </div>

          {/* Practice */}
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Practice</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/practice" className="text-slate-600 hover:text-blue-600 transition-colors">LeetCode Practice</Link></li>
              <li><Link href="/quiz" className="text-slate-600 hover:text-blue-600 transition-colors">Quiz</Link></li>
              <li><Link href="/speed-coding" className="text-slate-600 hover:text-blue-600 transition-colors">Speed Coding</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">GitHub</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-slate-900">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/docs" className="text-slate-600 hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="/faq" className="text-slate-600 hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-600 font-medium">
            © {currentYear} AlgoBuddy. Built for learners, by learners. 💙
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</Link>
            <Link href="/docs" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Docs</Link>
            <Link href="/faq" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">FAQ</Link>
            <Link href="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
