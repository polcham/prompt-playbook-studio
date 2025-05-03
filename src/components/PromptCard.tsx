
import { useState } from "react";
import { Link } from "react-router-dom";
import { Prompt } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard = ({ prompt }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "chatgpt":
        return <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">C</div>;
      case "midjourney":
        return <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">M</div>;
      case "claude":
        return <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">C</div>;
      case "dall-e":
        return <div className="w-6 h-6 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink">D</div>;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">A</div>;
    }
  };

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardContent className="pt-6 pb-2 flex-grow">
        <div className="flex items-center justify-between mb-3">
          {getToolIcon(prompt.tool)}
          {prompt.trending && (
            <Badge variant="outline" className="text-xs flex gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              Trending
            </Badge>
          )}
        </div>
        <Link to={`/prompt/${prompt.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">{prompt.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{prompt.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2">
        <div className="text-xs text-muted-foreground">{prompt.authorName}</div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs">
          {copied ? "Copied!" : "Copy"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;
