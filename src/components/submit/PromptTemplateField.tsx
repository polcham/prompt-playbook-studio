
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

const PromptTemplateField = ({ form, placeholdersHook }: PromptTemplateFieldProps) => {
  // Add a console log to check the value of placeholdersHook
  console.log("placeholdersHook in PromptTemplateField:", placeholdersHook);

  const [placeholderCommandOpen, setPlaceholderCommandOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaCursorPosition, setTextAreaCursorPosition] = useState<number | null>(null);
  const [cursorCoords, setCursorCoords] = useState({ top: 0, left: 0 });

  // Calculate cursor position for popover
  const calculateCursorCoordinates = useCallback(() => {
    if (!textareaRef.current || textAreaCursorPosition === null) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    
    // Create a mirror div to calculate position
    const mirror = document.createElement('div');
    mirror.style.cssText = getComputedStyle(textarea).cssText;
    mirror.style.height = 'auto';
    mirror.style.width = `${textarea.offsetWidth}px`;
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordBreak = 'break-word';
    mirror.style.paddingBottom = '0';
    document.body.appendChild(mirror);
    
    // Split text at cursor position
    const textBeforeCursor = text.substring(0, textAreaCursorPosition);
    const textAfterCursor = text.substring(textAreaCursorPosition);
    
    // Add content to the mirror
    mirror.textContent = textBeforeCursor;
    const cursorSpan = document.createElement('span');
    cursorSpan.textContent = '|';
    mirror.appendChild(cursorSpan);
    mirror.appendChild(document.createTextNode(textAfterCursor));
    
    // Get coordinates
    const cursorPos = cursorSpan.getBoundingClientRect();
    const textareaPos = textarea.getBoundingClientRect();
    
    const top = cursorPos.top - textareaPos.top + textarea.scrollTop;
    const left = cursorPos.left - textareaPos.left + textarea.scrollLeft;
    
    document.body.removeChild(mirror);
    
    setCursorCoords({ top, left });
  }, [textAreaCursorPosition]);

  useEffect(() => {
    if (placeholderCommandOpen) {
      calculateCursorCoordinates();
    }
  }, [placeholderCommandOpen, calculateCursorCoordinates]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setTextAreaCursorPosition(cursorPos);
    
    form.setValue("content", value);

    // Check if the last character typed is "/"
    if (value[cursorPos - 1] === "/" && !placeholderCommandOpen) {
      setPlaceholderCommandOpen(true);
      // We need to calculate coordinates after the state update
      setTimeout(calculateCursorCoordinates, 0);
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
                placeholder="Paste your full prompt template here. Use [PLACEHOLDERS] for customizable parts."
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
                  cursorCoords={cursorCoords}
                  placeholdersHook={placeholdersHook}
                />
              )}
            </div>
          </FormControl>
          <FormDescription>
            The complete prompt template with placeholders in [BRACKETS] for customizable parts. Type / to insert placeholder.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PromptTemplateField;
