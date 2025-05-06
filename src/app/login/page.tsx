
import { Metadata } from "next";
import Login from "@/components/pages/Login";

export const metadata: Metadata = {
  title: "Sign In - Prompt Playbook Studio",
  description: "Sign in to your account to access all features."
};

export default function LoginPage() {
  return <Login />;
}
