"use client";

import React from "react";
import { Moon, Sun, Laptop, Volume2, VolumeX, Mic, MicOff, Settings, Sparkles, Zap, Code, Palette, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store";
import { cn } from "@/lib/utils";
import type { ProgrammingLanguage, AnimationSpeed, Theme } from "@/types";

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const themes: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { value: "light", label: "Light", icon: Sun, color: "from-amber-400 to-orange-500" },
    { value: "dark", label: "Dark", icon: Moon, color: "from-blue-500 to-cyan-600" },
    { value: "system", label: "System", icon: Laptop, color: "from-cyan-400 to-blue-500" },
  ];

  const languages: { value: ProgrammingLanguage; label: string; color: string }[] = [
    { value: "python", label: "Python", color: "from-blue-400 to-blue-600" },
    { value: "javascript", label: "JavaScript", color: "from-yellow-400 to-amber-500" },
    { value: "java", label: "Java", color: "from-orange-400 to-red-500" },
    { value: "cpp", label: "C++", color: "from-blue-400 to-cyan-500" },
  ];

  const speeds: { value: AnimationSpeed; label: string; multiplier: string }[] = [
    { value: "slow", label: "Slow", multiplier: "0.5x" },
    { value: "normal", label: "Normal", multiplier: "1x" },
    { value: "fast", label: "Fast", multiplier: "2x" },
    { value: "instant", label: "Instant", multiplier: "4x" },
  ];

  const fontSizes = [12, 13, 14, 15, 16, 18, 20];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 py-12">
        <div className="container px-4 max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400">Customize your learning experience</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Appearance */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Appearance</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-slate-400 mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map(({ value, label, icon: Icon, color }) => (
                      <button
                        key={value}
                        onClick={() => updateSettings({ theme: value })}
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300",
                          settings.theme === value
                            ? `bg-gradient-to-br ${color} text-white shadow-lg scale-105`
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-white/5"
                        )}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{label}</span>
                        {settings.theme === value && (
                          <motion.div
                            layoutId="theme-indicator"
                            className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-3 block">
                    Font Size: <span className="text-purple-400 font-semibold">{settings.fontSize}px</span>
                  </label>
                  <div className="flex gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSettings({ fontSize: size })}
                        className={cn(
                          "w-12 h-12 rounded-xl font-medium transition-all duration-300",
                          settings.fontSize === size
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-110"
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-white/5"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Code Editor */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Code Editor</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-slate-400 mb-3 block">Default Language</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {languages.map(({ value, label, color }) => (
                      <button
                        key={value}
                        onClick={() => updateSettings({ defaultLanguage: value })}
                        className={cn(
                          "px-4 py-3 rounded-xl font-medium transition-all duration-300",
                          settings.defaultLanguage === value
                            ? `bg-gradient-to-br ${color} text-white shadow-lg`
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-white/5"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                  <div>
                    <div className="font-medium text-white">Code Highlighting</div>
                    <div className="text-sm text-slate-400">Highlight current line during animation</div>
                  </div>
                  <button
                    onClick={() => updateSettings({ showCodeHighlighting: !settings.showCodeHighlighting })}
                    className={cn(
                      "w-14 h-7 rounded-full transition-all duration-300 relative",
                      settings.showCodeHighlighting
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/25"
                        : "bg-slate-700"
                    )}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white absolute top-1 shadow-md"
                      animate={{ left: settings.showCodeHighlighting ? "calc(100% - 24px)" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                  <div>
                    <div className="font-medium text-white">Variable Panel</div>
                    <div className="text-sm text-slate-400">Show variables during animation</div>
                  </div>
                  <button
                    onClick={() => updateSettings({ showVariablePanel: !settings.showVariablePanel })}
                    className={cn(
                      "w-14 h-7 rounded-full transition-all duration-300 relative",
                      settings.showVariablePanel
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/25"
                        : "bg-slate-700"
                    )}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white absolute top-1 shadow-md"
                      animate={{ left: settings.showVariablePanel ? "calc(100% - 24px)" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Animation */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Animation Speed</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {speeds.map(({ value, label, multiplier }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ animationSpeed: value })}
                    className={cn(
                      "relative p-4 rounded-xl transition-all duration-300",
                      settings.animationSpeed === value
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-white/5"
                    )}
                  >
                    <div className="font-medium">{label}</div>
                    <div className={cn("text-sm", settings.animationSpeed === value ? "text-white/80" : "text-slate-500")}>
                      {multiplier}
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Audio */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Audio Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      settings.enableSound ? "bg-pink-500/20" : "bg-slate-700/50"
                    )}>
                      {settings.enableSound ? (
                        <Volume2 className="w-6 h-6 text-pink-400" />
                      ) : (
                        <VolumeX className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">Sound Effects</div>
                      <div className="text-sm text-slate-400">Play sounds during operations</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ enableSound: !settings.enableSound })}
                    className={cn(
                      "w-14 h-7 rounded-full transition-all duration-300 relative",
                      settings.enableSound
                        ? "bg-gradient-to-r from-pink-400 to-rose-500 shadow-lg shadow-pink-500/25"
                        : "bg-slate-700"
                    )}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white absolute top-1 shadow-md"
                      animate={{ left: settings.enableSound ? "calc(100% - 24px)" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      settings.enableVoiceNarration ? "bg-purple-500/20" : "bg-slate-700/50"
                    )}>
                      {settings.enableVoiceNarration ? (
                        <Mic className="w-6 h-6 text-purple-400" />
                      ) : (
                        <MicOff className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">Voice Narration</div>
                      <div className="text-sm text-slate-400">Read step descriptions aloud</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ enableVoiceNarration: !settings.enableVoiceNarration })}
                    className={cn(
                      "w-14 h-7 rounded-full transition-all duration-300 relative",
                      settings.enableVoiceNarration
                        ? "bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/25"
                        : "bg-slate-700"
                    )}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white absolute top-1 shadow-md"
                      animate={{ left: settings.enableVoiceNarration ? "calc(100% - 24px)" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Reset */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Reset Settings</h2>
                    <p className="text-sm text-slate-400">Restore all settings to default values</p>
                  </div>
                </div>
                <button
                  onClick={resetSettings}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                >
                  Reset All
                </button>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
