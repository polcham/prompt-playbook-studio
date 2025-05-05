
import { useState } from "react";
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
      authorName: "",
      tags: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);

    // In a real app, you would submit to an API
    setTimeout(() => {
      console.log(values);
      toast.success("Your prompt has been submitted for review!");
      form.reset();
      setIsSubmitting(false);
    }, 1000);
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
