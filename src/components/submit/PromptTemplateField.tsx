import React, { useRef, useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import PlaceholderSelector from "./PlaceholderSelector";
import { UsePlaceholdersReturn } from "@/hooks/usePlaceholders";
import { FormValues } from "./PromptFormFields";

interface PromptTemplateFieldProps {
  form: UseFormReturn<FormValues>;
  placeholdersHook: UsePlaceholdersReturn;
}

const PromptTemplateField = ({
  form,
  placeholdersHook,
}: PromptTemplateFieldProps) => {
  // Add a console log to check the value of placeholdersHook
  console.log("placeholdersHook in PromptTemplateField:", placeholdersHook);

  const [placeholderCommandOpen, setPlaceholderCommandOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaCursorPosition, setTextAreaCursorPosition] = useState<
    number | null
  >(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setTextAreaCursorPosition(cursorPos);

    form.setValue("content", value);

    // Check if the last character typed is "/"
    if (value[cursorPos - 1] === "/" && !placeholderCommandOpen) {
      setPlaceholderCommandOpen(true);
    }
  };

  const handlePlaceholderSelect = (placeholder: string) => {
    const currentContent = form.getValues("content");
    const cursorPos = textAreaCursorPosition || 0;

    // Insert the placeholder at the cursor position, replacing the "/"
    const newContent =
      currentContent.substring(0, cursorPos - 1) +
      `[${placeholder}]` +
      currentContent.substring(cursorPos);

    form.setValue("content", newContent);
    setPlaceholderCommandOpen(false);

    // Set focus back to the textarea and set cursor position after the inserted placeholder
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = cursorPos - 1 + placeholder.length + 2; // -1 for "/", +2 for "[]"
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setTextAreaCursorPosition(newCursorPos);
      }
    }, 0);
  };

  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field: { onChange, ...fieldProps } }) => (
        <FormItem className="relative">
          <FormLabel>Prompt Template</FormLabel>
          <FormControl>
            <div className="relative">
              <Textarea
                placeholder="The complete prompt template with placeholders in [BRACKETS] for customizable parts. Type / to insert placeholder."
                className="min-h-[200px] font-mono"
                onChange={handleContentChange}
                ref={textareaRef}
                {...fieldProps}
              />

              {/* Only render the PlaceholderSelector if placeholdersHook is defined */}
              {placeholdersHook && (
                <PlaceholderSelector
                  isOpen={placeholderCommandOpen}
                  onOpenChange={setPlaceholderCommandOpen}
                  onSelect={handlePlaceholderSelect}
                  placeholdersHook={placeholdersHook}
                />
              )}
            </div>
          </FormControl>
          {/* <FormDescription>
            The complete prompt template with placeholders in [BRACKETS] for customizable parts. Type / to insert placeholder.
          </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PromptTemplateField;
