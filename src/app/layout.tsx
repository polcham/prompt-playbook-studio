
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/index.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap" 
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Prompt Playbook Studio",
  description: "Craft perfect prompts for any AI tool with ease",
  openGraph: {
    type: "website",
    title: "Prompt Playbook Studio",
    description: "Craft perfect prompts for any AI tool with ease",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

// Create a client component wrapper for React Query
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        <QueryClientProvider client={queryClient}>
          <DarkModeProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </DarkModeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
