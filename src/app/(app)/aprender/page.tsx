import type { Metadata } from "next";
import { PHP_COURSE } from "@/content/php/course";
import { Roadmap } from "@/features/curriculum/roadmap";

export const metadata: Metadata = { title: "Aprender" };

export default function LearnPage() {
  return <Roadmap course={PHP_COURSE} />;
}
