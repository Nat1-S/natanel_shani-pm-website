import { createClient, isSupabaseConfigured } from "./client";
import type { AboutContent } from "@/types/about";

export const HERO_DEFAULT = {
  heroTagline:
    "From 10 years of IDF combat leadership to building products.\nBlending strategic thinking with hands-on technical execution.",
  heroSkills: ["Product Lifecycle", "AI-Driven", "Data-Driven", "UX/UI", "Leadership"],
};

export const ABOUT_DEFAULT: AboutContent = {
  ...HERO_DEFAULT,
  greeting: "Hi, I'm Natanel! 👋",
  intro:
    "I'm a Product Manager who believes that truly great technology is about solving complex problems simply—especially when those problems are mission-critical and happen in real-time. Today, I lead the development of AI-driven tools designed to make operational data accessible to security forces. My goal is simple: transforming complex information into smart, rapid decisions that save lives in the field.",
  journeyTitle: "A bit about my journey",
  journey:
    "I entered the product world after more than a decade as a combat officer (Major). Having commanded hundreds of soldiers in the most challenging situations, I learned that management is, first and foremost, about people—listening to needs and making high-pressure decisions.",
  educationTitle: "In between",
  education:
    "I hold a B.A. in Political Science and Military & Security Studies and an M.B.A. in Business Administration & Information Systems. Always looking for the next angle to connect data, strategy, and a seamless user experience.",
  reachOutTitle: "Feel free to reach out",
  reachOut:
    "I'd love to talk about product, AI, strategy, or just share management insights.",
  email: "Natanel.Shani@gmail.com",
  linkedinUrl: "https://linkedin.com/in/natanel-shani/",
};

export async function getAbout(): Promise<AboutContent> {
  if (!isSupabaseConfigured) return ABOUT_DEFAULT;
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .eq("id", "content")
      .single();
    if (!error && data?.content) {
      return { ...ABOUT_DEFAULT, ...(data.content as Partial<AboutContent>) };
    }
  } catch (e) {
    console.error(e);
  }
  return ABOUT_DEFAULT;
}

export async function setAbout(data: AboutContent): Promise<void> {
  const supabase = createClient();
  if (!isSupabaseConfigured) return;
  await supabase.from("about").upsert({ id: "content", content: data });
}
