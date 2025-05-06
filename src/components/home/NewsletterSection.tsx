
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Get weekly prompt inspiration
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our newsletter and receive hand-picked AI prompt templates, tips, and tricks directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
