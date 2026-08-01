import { VisualizerShell } from "@/components/VisualizerShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visualizer",
  description: "Interactive algorithm visualizer — explore sorting, graphs, trees, dynamic programming, and more.",
};

export default function VisualizerPage() {
  return <VisualizerShell />;
}
