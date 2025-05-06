
import { Metadata } from "next";
import { getPromptById } from "@/data/prompts";
import { notFound } from "next/navigation";
import PromptDetail from "@/components/pages/PromptDetail";

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prompt = getPromptById(params.id);
  
  if (!prompt) {
    return {
      title: "Prompt not found - Prompt Playbook Studio",
      description: "This prompt could not be found."
    };
  }
  
  return {
    title: `${prompt.title} - Prompt Playbook Studio`,
    description: prompt.description
  };
}

export default function PromptDetailPage({ params }: Props) {
  const prompt = getPromptById(params.id);
  
  if (!prompt) {
    notFound();
  }
  
  return <PromptDetail promptId={params.id} />;
}
