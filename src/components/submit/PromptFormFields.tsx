
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { promptCategories, promptTools } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import PromptTemplateField from "./PromptTemplateField";
import { UsePlaceholdersReturn } from "@/hooks/usePlaceholders";

export interface FormValues {
  title: string;
  description: string;
  content: string;
  tool: string;
  category: string;
  authorName: string;
  tags: string;
}

interface PromptFormFieldsProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  placeholdersHook: UsePlaceholdersReturn;
}

const PromptFormFields = ({
  form,
  isSubmitting,
  placeholdersHook,
}: PromptFormFieldsProps) => {
  return (
    <>
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

      <PromptTemplateField 
        form={form} 
        placeholdersHook={placeholdersHook} 
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
    </>
  );
};

export default PromptFormFields;
