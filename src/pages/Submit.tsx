
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { usePlaceholders } from "@/hooks/usePlaceholders";
import PromptFormFields, { FormValues } from "@/components/submit/PromptFormFields";
import AuthPrompt from "@/components/AuthPrompt";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(20, { message: "Prompt content must be at least 20 characters" }),
  tool: z.string(),
  category: z.string(),
  authorName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  tags: z.string(),
});

// Mock authentication to demonstrate functionality
// In a real application, this would come from your auth provider
const mockAuth = {
  isAuthenticated: true,
  user: {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com"
  }
};

const Submit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(mockAuth.isAuthenticated);
  // Add console log to verify placeholders hook is initialized correctly
  const placeholdersHook = usePlaceholders();
  console.log("placeholdersHook in Submit:", placeholdersHook);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      tool: "chatgpt",
      category: "writing",
      authorName: isAuthenticated ? mockAuth.user.name : "",
      tags: "",
    },
  });

  // Update the author name whenever authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      form.setValue("authorName", mockAuth.user.name);
    }
  }, [isAuthenticated, form]);

  const onSubmit = (values: FormValues) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to submit a prompt.");
      return;
    }

    setIsSubmitting(true);

    // In a real app, you would submit to an API
    setTimeout(() => {
      console.log(values);
      toast.success("Your prompt has been submitted for review!");
      form.reset({
        ...form.getValues(),
        title: "",
        description: "",
        content: "",
        tags: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit a Prompt</h1>
              <p className="text-muted-foreground">
                Share your best AI prompt templates with our community.
              </p>
            </div>
            <AuthPrompt 
              title="Sign in to submit prompts"
              description="You need to be signed in to share your prompts with the community."
              onSuccess={() => setIsAuthenticated(true)}
            />
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
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit a Prompt</h1>
            <p className="text-muted-foreground">
              Share your best AI prompt templates with our community.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <PromptFormFields 
                    form={form} 
                    isSubmitting={isSubmitting} 
                    placeholdersHook={placeholdersHook}
                    hideAuthorField={isAuthenticated}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Submit;
