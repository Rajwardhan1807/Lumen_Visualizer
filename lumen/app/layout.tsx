import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumen — Algorithm Visualizer",
    template: "%s | Lumen",
  },
  description:
    "A premium, interactive algorithm visualizer for learners, interview candidates, and educators. Visualize sorting, graphs, trees, dynamic programming, and more.",
  keywords: [
    "algorithm visualizer",
    "data structures",
    "sorting algorithms",
    "graph algorithms",
    "binary search tree",
    "dynamic programming",
    "interview preparation",
    "computer science",
  ],
  authors: [{ name: "Lumen" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Lumen — Algorithm Visualizer",
    description: "Premium algorithm visualization. Sorting, graphs, trees, DP, and more.",
    siteName: "Lumen",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen — Algorithm Visualizer",
    description: "Premium algorithm visualization. Sorting, graphs, trees, DP, and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
