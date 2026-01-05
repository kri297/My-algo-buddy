import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomArray(length: number, min = 1, max = 100): number[] {
  return Array.from({ length }, () => randomInt(min, max));
}

export function swap<T>(arr: T[], i: number, j: number): T[] {
  const newArr = [...arr];
  [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  return newArr;
}

export function formatComplexity(notation: string): string {
  return notation
    .replace(/O\((.*)\)/, "O($1)")
    .replace(/\^(\d+)/g, "<sup>$1</sup>")
    .replace(/log/g, "log");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
