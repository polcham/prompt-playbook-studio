
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
          <span className="gradient-text">Craft perfect prompts</span> for any 
          AI tool with ease
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover, copy, and customize prompt templates for ChatGPT, Midjourney, Claude, and more.
          Boost your AI productivity in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button size="lg" asChild className="flex-1">
            <Link href="/library">Browse Templates</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="flex-1">
            <Link href="/submit">Submit a Prompt</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
