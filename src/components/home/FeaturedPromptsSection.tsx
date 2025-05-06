
import { getFeaturedPrompts } from "@/data/prompts";
import PromptCard from "@/components/PromptCard";
import Link from "next/link";

export default function FeaturedPromptsSection() {
  const featuredPrompts = getFeaturedPrompts();
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Templates</h2>
          <Link href="/library" className="text-primary font-medium hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </section>
  );
}
