
import { Metadata } from "next";
import Library from "@/components/pages/Library";

export const metadata: Metadata = {
  title: "Prompt Library - Prompt Playbook Studio",
  description: "Browse our collection of AI prompt templates for various tools and use cases."
};

export default function LibraryPage() {
  return <Library />;
}
