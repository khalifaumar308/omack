import type { GradingTemplate } from "@/components/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scoreToComment(template: GradingTemplate, score: number): string {
  const band = template.commentBands.find(b => score >= b.minScore && score <= b.maxScore);
  return band ? band.comment : "Not Set";
} 

export function getMonthAndYearInThreeYears(dateString:string) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "N/A";
  }

  // Add 3 years
  date.setFullYear(date.getFullYear() + 3);

  // Extract Month and Year
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${month}, ${year}`;
}