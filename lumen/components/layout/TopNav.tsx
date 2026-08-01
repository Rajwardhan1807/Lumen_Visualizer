"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Sun, Moon, GitCompare, Share2, Settings, Command, Search,
  User, HelpCircle, Zap,
} from "lucide-react";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { selectedCategory, selectedSlug, compareMode, toggleCompareMode } = useAlgorithmStore();

  useEffect(() => setMounted(true), []);

  const breadcrumb = selectedSlug
    ? selectedSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  const category = selectedCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <header
      className="sticky top-0 z-nav h-16 bg-bg-elevated border-b border-border-subtle"
      style={{ boxShadow: "var(--shadow-nav)" }}
    >
      <div className="flex items-center h-full px-6 gap-4">
        {/* Left — Logo + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center shadow-level-1">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-h3 text-text-primary font-semibold hidden sm:block">Lumen</span>
          </div>

          {breadcrumb && (
            <div className="hidden md:flex items-center gap-1.5 text-body text-text-secondary">
              <span className="text-text-tertiary">›</span>
              <span className="capitalize">{category}</span>
              <span className="text-text-tertiary">›</span>
              <span className="text-text-primary font-medium">{breadcrumb}</span>
            </div>
          )}
        </div>

        {/* Center — Command palette trigger (≥1280px) */}
        <div className="flex-1 flex justify-center px-4">
          <button
            className="hidden xl:flex items-center gap-3 w-full max-w-[360px] h-10 px-4 rounded-full surface-inset text-text-tertiary text-body hover:text-text-secondary transition-colors cursor-text"
            onClick={() => {
              // TODO: open command palette
            }}
            aria-label="Open command palette"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Search algorithms…</span>
            <div className="flex items-center gap-0.5 bg-bg-elevated px-1.5 py-0.5 rounded-sm">
              <Command className="w-3 h-3" />
              <span className="text-caption font-mono">K</span>
            </div>
          </button>
        </div>

        {/* Right — Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <NavIconButton
            onClick={toggleCompareMode}
            active={compareMode}
            label="Compare algorithms"
            title="Compare algorithms (GitCompare)"
          >
            <GitCompare className="w-4.5 h-4.5" />
          </NavIconButton>

          <NavIconButton label="Share visualization" title="Share">
            <Share2 className="w-4.5 h-4.5" />
          </NavIconButton>

          {mounted && (
            <NavIconButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title="Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                >
                  {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </motion.div>
              </AnimatePresence>
            </NavIconButton>
          )}

          <NavIconButton label="Settings" title="Settings">
            <Settings className="w-4.5 h-4.5" />
          </NavIconButton>

          <NavIconButton label="Help" title="Keyboard shortcuts">
            <HelpCircle className="w-4.5 h-4.5" />
          </NavIconButton>

          {/* Avatar */}
          <button
            className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-level-1 hover:shadow-level-2 transition-shadow ml-1"
            aria-label="Profile menu"
          >
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}

interface NavIconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
  title?: string;
  active?: boolean;
}

function NavIconButton({ children, onClick, label, title, active }: NavIconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={title}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-[160ms]",
        "text-text-secondary hover:text-text-primary",
        "shadow-level-1 hover:shadow-level-2 active:shadow-inset",
        "bg-bg-elevated",
        active && "text-primary-500 bg-primary-500/10"
      )}
    >
      {children}
    </button>
  );
}
