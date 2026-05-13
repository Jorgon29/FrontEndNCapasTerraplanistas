import CtaSection from "@/features/landing/components/CtaSection";
import Features from "@/features/landing/components/Features";
import Footer from "@/features/landing/components/Footer";
import Hero from "@/features/landing/components/Hero";
import HowItWorks from "@/features/landing/components/HowItWorks";
import Navbar from "@/features/landing/components/NavBar";
import TrustedBy from "@/features/landing/components/TrustedBy";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </div>
  );
}
