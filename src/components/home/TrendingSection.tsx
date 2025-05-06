
import { getTrendingPrompts } from "@/data/prompts";
import PromptCard from "@/components/PromptCard";
import Link from "next/link";

export default function TrendingSection() {
  const trendingPrompts = getTrendingPrompts();
  
  return (
    <section className="py-16 bg-muted/50 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up text-brand-purple">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              Trending Now
            </span>
          </h2>
          <Link href="/library" className="text-primary font-medium hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </section>
  );
}
