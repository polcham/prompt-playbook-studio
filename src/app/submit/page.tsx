
import { Metadata } from "next";
import Submit from "@/components/pages/Submit";

export const metadata: Metadata = {
  title: "Submit a Prompt - Prompt Playbook Studio",
  description: "Share your best AI prompt templates with our community."
};

export default function SubmitPage() {
  return <Submit />;
}
