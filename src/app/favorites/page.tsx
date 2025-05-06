
import { Metadata } from "next";
import Favorites from "@/components/pages/Favorites";

export const metadata: Metadata = {
  title: "Your Favorites - Prompt Playbook Studio",
  description: "View and manage your favorite prompts."
};

export default function FavoritesPage() {
  return <Favorites />;
}
