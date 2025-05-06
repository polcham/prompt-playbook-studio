
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedPromptsSection from "@/components/home/FeaturedPromptsSection";
import TrendingSection from "@/components/home/TrendingSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedPromptsSection />
        <TrendingSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
