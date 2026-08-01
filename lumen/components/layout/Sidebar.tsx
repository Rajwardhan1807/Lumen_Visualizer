"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Search, PanelLeft,
  ListOrdered, Binary, Waypoints, TreePine, Link2,
  Layers, ArrowRightLeft, RefreshCw, Grid3x3, Zap, GitBranchPlus,
} from "lucide-react";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";
import { algorithmRegistry, categoriesConfig } from "@/lib/algorithms/registry";
import type { AlgorithmCategory } from "@/lib/types/algorithm";
import { cn } from "@/lib/utils/cn";

const CATEGORY_ICONS: Record<AlgorithmCategory, React.ReactNode> = {
  sorting: <ListOrdered className="w-4 h-4" />,
  searching: <Binary className="w-4 h-4" />,
  graphs: <Waypoints className="w-4 h-4" />,
  trees: <TreePine className="w-4 h-4" />,
  "linked-lists": <Link2 className="w-4 h-4" />,
  stacks: <Layers className="w-4 h-4" />,
  queues: <ArrowRightLeft className="w-4 h-4" />,
  recursion: <RefreshCw className="w-4 h-4" />,
  "dynamic-programming": <Grid3x3 className="w-4 h-4" />,
  greedy: <Zap className="w-4 h-4" />,
  backtracking: <GitBranchPlus className="w-4 h-4" />,
};

const DIFFICULTY_COLORS = {
  beginner: "text-success-500 bg-success-500/10",
  intermediate: "text-warning-500 bg-warning-500/10",
  advanced: "text-danger-500 bg-danger-500/10",
};

const CATEGORY_ORDER: AlgorithmCategory[] = [
  "sorting", "searching", "graphs", "trees", "linked-lists",
  "stacks", "queues", "recursion", "dynamic-programming", "greedy", "backtracking",
];

function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  let qIdx = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) qIdx++;
  }
  return qIdx === q.length;
}

function Highlight({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-500/30 text-amber-900 dark:text-amber-100 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export function Sidebar() {
  const { sidebarOpen, selectedSlug, selectAlgorithm, toggleSidebar } =
    useAlgorithmStore();
  const [openCategories, setOpenCategories] = useState<Set<AlgorithmCategory>>(
    new Set(["sorting"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Set<string>>(new Set());

  // Determine which algorithms match search query and filters
  const matchedSlugs = useMemo(() => {
    const matched = new Set<string>();
    const q = searchQuery.trim().toLowerCase();

    for (const [slug, entry] of Object.entries(algorithmRegistry)) {
      // Difficulty match
      if (difficultyFilter.size > 0 && !difficultyFilter.has(entry.meta.difficulty)) {
        continue;
      }

      if (!q) {
        matched.add(slug);
        continue;
      }

      // Name search
      if (fuzzyMatch(entry.meta.name, q)) {
        matched.add(slug);
        continue;
      }

      // Category search
      if (fuzzyMatch(entry.meta.category, q)) {
        matched.add(slug);
        continue;
      }

      // Tags search
      if (entry.meta.tags?.some((tag) => fuzzyMatch(tag, q))) {
        matched.add(slug);
        continue;
      }

      // Complexity search
      const c = entry.meta.complexity;
      if (
        fuzzyMatch(c.best, q) ||
        fuzzyMatch(c.average, q) ||
        fuzzyMatch(c.worst, q) ||
        fuzzyMatch(c.space, q)
      ) {
        matched.add(slug);
        continue;
      }
    }
    return matched;
  }, [searchQuery, difficultyFilter]);

  // Auto-expand categories containing matching items when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const nextOpen = new Set<AlgorithmCategory>();
      for (const [cat, config] of Object.entries(categoriesConfig)) {
        const hasMatch = config.algorithms.some((slug) => matchedSlugs.has(slug));
        if (hasMatch) {
          nextOpen.add(cat as AlgorithmCategory);
        }
      }
      setOpenCategories(nextOpen);
    }
  }, [searchQuery, matchedSlugs]);

  const toggleCategory = (cat: AlgorithmCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 280 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col h-full bg-bg-elevated border-r border-border-subtle overflow-hidden shrink-0"
      style={{ zIndex: "var(--z-sidebar)" }}
    >
      {/* Search Input */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 border-b border-border-subtle"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, tag, complexity..."
                className="w-full pl-8 pr-3 py-2 rounded-md text-body bg-bg-sunken text-text-primary placeholder:text-text-tertiary focus:outline-none"
                style={{ boxShadow: "var(--shadow-inset)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto py-2">
        {CATEGORY_ORDER.map((cat) => {
          const config = categoriesConfig[cat];
          const visibleAlgorithms = config.algorithms.filter((slug) => matchedSlugs.has(slug));
          const hasVisibleAlgorithms = visibleAlgorithms.length > 0;
          const isOpen = openCategories.has(cat);

          // If searching and this category has no matches, hide it
          if (searchQuery.trim() && !hasVisibleAlgorithms) return null;

          return (
            <div key={cat}>
              <button
                onClick={() => hasVisibleAlgorithms && toggleCategory(cat)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-body text-text-secondary transition-all duration-[160ms]",
                  "hover:text-text-primary hover:bg-primary-500/5 rounded-md mx-1",
                  !sidebarOpen && "justify-center"
                )}
                title={!sidebarOpen ? config.label : undefined}
                aria-expanded={isOpen}
              >
                <span className="text-text-tertiary shrink-0">{CATEGORY_ICONS[cat]}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium text-[13px]">{config.label}</span>
                    {hasVisibleAlgorithms && (
                      <>
                        <span className="text-label text-text-tertiary bg-bg-sunken px-1.5 py-0.5 rounded-xs">
                          {visibleAlgorithms.length}
                        </span>
                        <ChevronRight
                          className={cn("w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 shrink-0", isOpen && "rotate-90")}
                        />
                      </>
                    )}
                  </>
                )}
              </button>

              {sidebarOpen && isOpen && hasVisibleAlgorithms && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 pr-2 pb-1 space-y-0.5">
                    {visibleAlgorithms.map((slug) => {
                      const entry = algorithmRegistry[slug];
                      if (!entry) return null;
                      return (
                        <AlgorithmItem
                          key={slug}
                          slug={slug}
                          name={entry.meta.name}
                          highlightText={searchQuery}
                          difficulty={entry.meta.difficulty}
                          active={selectedSlug === slug}
                          sidebarOpen={sidebarOpen}
                          onClick={() => selectAlgorithm(cat, slug)}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: Difficulty filter + collapse toggle */}
      <div className="border-t border-border-subtle">
        {sidebarOpen && (
          <div className="px-3 py-2 flex flex-wrap gap-1.5">
            {(["beginner", "intermediate", "advanced"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter((prev) => {
                  const next = new Set(prev);
                  if (next.has(d)) next.delete(d);
                  else next.add(d);
                  return next;
                })}
                className={cn(
                  "text-label px-2 py-1 rounded-xs transition-all duration-[160ms] capitalize",
                  difficultyFilter.has(d)
                    ? DIFFICULTY_COLORS[d]
                    : "text-text-tertiary bg-bg-sunken hover:text-text-secondary"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <div className={cn("p-2", !sidebarOpen && "flex justify-center")}>
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-primary-500/5 transition-all duration-[160ms]"
          >
            <PanelLeft className={cn("w-4 h-4 shrink-0 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
            {sidebarOpen && <span className="text-body">Collapse</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

interface AlgorithmItemProps {
  slug: string;
  name: string;
  highlightText: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  active: boolean;
  sidebarOpen: boolean;
  onClick: () => void;
}

function AlgorithmItem({ name, highlightText, difficulty, active, sidebarOpen, onClick }: AlgorithmItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-body transition-all duration-[160ms] text-left",
        active
          ? "text-primary-500 active-rail"
          : "text-text-secondary hover:text-text-primary hover:shadow-level-1",
        active && "bg-primary-500/8"
      )}
      style={active ? { boxShadow: "var(--shadow-inset)" } : {}}
    >
      {sidebarOpen && (
        <>
          <span className="flex-1 text-[13px] font-medium truncate">
            <Highlight text={name} highlight={highlightText} />
          </span>
          <span className={cn("text-label px-1.5 py-0.5 rounded-xs capitalize shrink-0", DIFFICULTY_COLORS[difficulty])}>
            {difficulty.charAt(0).toUpperCase()}
          </span>
        </>
      )}
    </button>
  );
}
