
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { promptCategories, promptTools } from "@/data/prompts";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(20, { message: "Prompt content must be at least 20 characters" }),
  tool: z.string(),
  category: z.string(),
  authorName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  tags: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const Submit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Blog Outline Generator" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear and concise title for your prompt template.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Briefly describe what this prompt does" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short description that will appear in prompt cards.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="tool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Tool</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an AI tool" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {promptTools.slice(1).map((tool) => (
                                <SelectItem key={tool.id} value={tool.id}>
                                  {tool.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Which AI tool is this prompt designed for?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {promptCategories.slice(1).map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the most relevant category for your prompt.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt Template</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your full prompt template here. Use [PLACEHOLDERS] for customizable parts."
                            className="min-h-[200px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The complete prompt template with placeholders in [BRACKETS] for customizable parts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., copywriting, SEO, marketing (comma separated)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Add relevant tags to help others find your prompt (comma separated).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="How you want to be credited" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your name or username to be shown as the author.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Prompt for Review"}
                  </Button>
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
