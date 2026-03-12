import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { LabsSection } from "@/components/home/LabsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="rounded-3xl overflow-hidden">
          <Hero />
        </div>
        <AboutSection />
        <CaseStudiesSection />
        <LabsSection />
      </div>
    </div>
  );
}
