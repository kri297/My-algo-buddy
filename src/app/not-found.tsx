"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, BookOpen, Code, Play } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(99, 102, 241, 0)",
                  "0 0 20px rgba(99, 102, 241, 0.5)",
                  "0 0 0px rgba(99, 102, 241, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10rem] sm:text-[12rem] font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none"
            >
              404
            </motion.span>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 text-4xl"
            >
              🔍
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-2 -left-4 text-3xl"
            >
              ⚙️
            </motion.div>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The algorithm for finding this page returned -1. 
            It seems like this node doesn&apos;t exist in our tree.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Or explore these popular sections:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/learn"
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Learn</span>
            </Link>
            <Link
              href="/visualize"
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Play className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Visualize</span>
            </Link>
            <Link
              href="/playground"
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Code className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Playground</span>
            </Link>
            <Link
              href="/simulators"
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Search className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Simulators</span>
            </Link>
          </div>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-4 bg-muted/50 rounded-lg border border-border"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">💡 Fun fact:</span>{" "}
            Binary search would need only log₂(n) steps to find out this page doesn&apos;t exist!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
