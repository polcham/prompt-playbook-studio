
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
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(20, { message: "Prompt content must be at least 20 characters" }),
  tool: z.string(),
  category: z.string(),
  authorName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  tags: z.string(),
});

const Submit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, session } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const placeholdersHook = usePlaceholders();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      tool: "chatgpt",
      category: "writing",
      authorName: isAuthenticated ? user?.email?.split('@')[0] || "" : "",
      tags: "",
    },
  });

  // Update the author name whenever authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue("authorName", user.email?.split('@')[0] || "");
    }
  }, [isAuthenticated, user, form]);

  const onSubmit = async (values: FormValues) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to submit a prompt.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert comma-separated tags to array
      const tagsArray = values.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
      
      // Insert prompt into Supabase
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          title: values.title,
          description: values.description,
          content: values.content,
          tool: values.tool,
          category: values.category,
          author_id: user?.id as string,
          author_name: values.authorName,
          tags: tagsArray,
          is_approved: false // Prompts need approval before being publicly visible
        });

      if (error) {
        console.error("Error submitting prompt:", error);
        toast.error("Failed to submit prompt. Please try again.");
      } else {
        toast.success("Your prompt has been submitted for review!");
        form.reset({
          ...form.getValues(),
          title: "",
          description: "",
          content: "",
          tags: "",
        });
        
        // Redirect to library after successful submission
        setTimeout(() => {
          navigate("/library");
        }, 1500);
      }
    } catch (error) {
      console.error("Exception submitting prompt:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <Card className="relative">
            {!isAuthenticated && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Sign in to submit a prompt</h2>
                <p className="text-muted-foreground mb-6">
                  You need to be signed in to submit prompts and share with the community.
                </p>
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
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
