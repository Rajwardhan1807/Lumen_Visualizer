"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, ListOrdered, Waypoints, TreePine,
  Grid3x3, Binary, GitBranchPlus, Play, RefreshCw,
  ArrowRightLeft, Layers,
} from "lucide-react";

const CATEGORIES = [
  { icon: <ListOrdered className="w-5 h-5" />, label: "Sorting", desc: "Bubble, Merge, Quick, Heap…", color: "var(--primary-500)" },
  { icon: <Binary className="w-5 h-5" />, label: "Searching", desc: "Linear & Binary Search", color: "var(--secondary-500)" },
  { icon: <Waypoints className="w-5 h-5" />, label: "Graphs", desc: "BFS, DFS, Dijkstra's", color: "var(--info-500)" },
  { icon: <TreePine className="w-5 h-5" />, label: "Trees", desc: "BST, Traversals", color: "var(--success-500)" },
  { icon: <Grid3x3 className="w-5 h-5" />, label: "Dynamic Programming", desc: "Fibonacci, Knapsack, LCS", color: "var(--warning-500)" },
  { icon: <GitBranchPlus className="w-5 h-5" />, label: "Backtracking", desc: "N-Queens, Subset Sum", color: "var(--danger-500)" },
  { icon: <RefreshCw className="w-5 h-5" />, label: "Recursion", desc: "Factorial, Fibonacci", color: "var(--accent-500)" },
  { icon: <Layers className="w-5 h-5" />, label: "Stacks", desc: "Push, Pop, Peek", color: "var(--primary-400)" },
  { icon: <ArrowRightLeft className="w-5 h-5" />, label: "Queues", desc: "Enqueue, Dequeue", color: "var(--secondary-500)" },
];

const FEATURES = [
  {
    emoji: "✨",
    title: "Synchronized 4-Pane View",
    desc: "Canvas, Explanation, Pseudocode, and Code all advance in lockstep on one timeline.",
  },
  {
    emoji: "🎨",
    title: "Soft UI 2026 Design",
    desc: "Premium neumorphic design with consistent light/dark themes and tactile, physical animations.",
  },
  {
    emoji: "⌨️",
    title: "Keyboard-First",
    desc: "Space to play, ← → to step, R to reset, ⌘K for command palette. Every action reachable without a mouse.",
  },
  {
    emoji: "⚡",
    title: "60fps at Scale",
    desc: "Canvas2D rendering path for large arrays. Smooth spring animations using Framer Motion.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-nav h-16 bg-bg-elevated border-b border-border-subtle flex items-center justify-between px-8" style={{ boxShadow: "var(--shadow-nav)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center shadow-level-1">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-h3 font-semibold">Lumen</span>
        </div>
        <Link
          href="/visualizer"
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-primary-500 text-white text-body font-medium shadow-level-1 hover:shadow-level-2 transition-all duration-[160ms] hover:bg-primary-400"
        >
          Open App
          <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Ambient background bars */}
        <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-[0.06] pointer-events-none px-8 pb-0" aria-hidden>
          {[40, 70, 55, 90, 35, 80, 60, 45, 75, 50, 85, 30, 65, 88, 42, 72, 58, 93, 38, 68].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                backgroundColor: i % 3 === 0 ? "var(--primary-500)" : i % 3 === 1 ? "var(--secondary-500)" : "var(--success-500)",
                animation: `ambientBar ${2 + (i % 4) * 0.5}s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-label text-primary-500 border border-primary-500/30 bg-primary-500/8">
            <Zap className="w-3 h-3" />
            Algorithm Visualizer — Lumen
          </div>

          <h1 className="text-h1 font-bold mb-6 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.15 }}>
            <span className="gradient-text">See algorithms think.</span>
            <br />
            <span className="text-text-primary">Not just run.</span>
          </h1>

          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            A premium, SaaS-quality algorithm visualization platform. Watch Bubble Sort, Dijkstra's, dynamic programming tables, and N-Queens backtracking animate step-by-step — with synchronized explanations, pseudocode, and code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/visualizer"
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary-500 text-white text-body-lg font-semibold shadow-level-2 hover:shadow-level-3 hover:bg-primary-400 transition-all duration-[160ms] active:scale-[0.97]"
            >
              <Play className="w-5 h-5 fill-white" />
              Start Visualizing
            </Link>
            <Link
              href="/visualizer"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-body-lg font-medium text-text-secondary shadow-level-1 hover:shadow-level-2 bg-bg-elevated transition-all duration-[160ms]"
            >
              Browse Algorithms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Category chips */}
      <section className="px-6 pb-20">
        <p className="text-label text-text-tertiary text-center mb-8">11 Algorithm Categories</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                href="/visualizer"
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-bg-elevated shadow-level-1 hover:shadow-level-2 transition-all duration-[160ms] group"
              >
                <span style={{ color: cat.color }}>{cat.icon}</span>
                <div className="text-left">
                  <p className="text-body font-semibold text-text-primary group-hover:text-primary-500 transition-colors">{cat.label}</p>
                  <p className="text-caption text-text-tertiary">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-h2 text-text-primary text-center mb-12">Built different.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-bg-elevated shadow-level-1 hover:shadow-level-2 transition-all duration-[160ms]"
            >
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="text-h3 text-text-primary mb-2">{f.title}</h3>
              <p className="text-body text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto p-10 rounded-xl text-center" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-500) 12%, var(--bg-elevated)), color-mix(in srgb, var(--secondary-500) 8%, var(--bg-elevated)))", boxShadow: "var(--shadow-2)" }}>
          <h2 className="text-h2 text-text-primary mb-4">Ready to level up?</h2>
          <p className="text-body-lg text-text-secondary mb-8">Understand algorithms deeply. Ace your technical interviews.</p>
          <Link
            href="/visualizer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-500 text-white text-body-lg font-semibold shadow-level-2 hover:shadow-level-3 hover:bg-primary-400 transition-all duration-[160ms]"
          >
            Open Lumen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-text-tertiary">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary-500" />
          <span>Lumen — Algorithm Visualizer</span>
        </div>
        <span>Built with Next.js · TypeScript · Framer Motion</span>
      </footer>

      <style jsx>{`
        @keyframes ambientBar {
          from { transform: scaleY(0.85); }
          to { transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
}
