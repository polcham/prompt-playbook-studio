
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPromptById, getPromptsByCategory, Prompt } from "@/data/prompts";
import { toast } from "sonner";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPrompt = getPromptById(id);
      setPrompt(foundPrompt);

      if (foundPrompt) {
        const related = getPromptsByCategory(foundPrompt.category)
          .filter((p) => p.id !== foundPrompt.id)
          .slice(0, 3);
        setRelatedPrompts(related);
      }
    }
  }, [id]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getToolLabel = (tool: string) => {
    const labels: Record<string, string> = {
      chatgpt: "ChatGPT",
      midjourney: "Midjourney",
      claude: "Claude",
      "dall-e": "DALL-E",
      other: "Other",
    };
    return labels[tool] || "AI Tool";
  };

  if (!prompt) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-16 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Prompt not found</h1>
            <p className="text-muted-foreground mb-8">
              The prompt you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/library">Back to Library</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Library
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Badge>{getToolLabel(prompt.tool)}</Badge>
                  <Badge variant="outline">{prompt.category}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{prompt.title}</h1>
                <p className="text-muted-foreground">{prompt.description}</p>
              </div>

              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Prompt Template</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                    {prompt.content}
                  </div>
                </CardContent>
              </Card>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">How to use this prompt</h3>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">1. Copy the template</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the "Copy" button above to copy the entire prompt template to your clipboard.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">2. Fill in your specifics</h4>
                    <p className="text-sm text-muted-foreground">
                      Replace the placeholder text (typically in [BRACKETS]) with your specific information.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">3. Paste into your AI tool</h4>
                    <p className="text-sm text-muted-foreground">
                      Paste the completed prompt into {getToolLabel(prompt.tool)} and let the AI work its magic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-muted/50 p-6 rounded-lg border mb-8">
                  <h3 className="font-semibold mb-4">Prompt Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tool</span>
                      <span className="font-medium">{getToolLabel(prompt.tool)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium capitalize">{prompt.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created by</span>
                      <span className="font-medium">{prompt.authorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{prompt.createdAt}</span>
                    </div>
                  </div>
                </div>

                {relatedPrompts.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Related Prompts</h3>
                    <div className="space-y-3">
                      {relatedPrompts.map((related) => (
                        <Link to={`/prompt/${related.id}`} key={related.id}>
                          <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <h4 className="font-medium mb-1">{related.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {related.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromptDetail;
