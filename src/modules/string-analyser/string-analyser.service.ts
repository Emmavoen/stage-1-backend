import crypto from "crypto";
import type { IStringProperties } from "./string-analyser.interface";

// Interface for the properties object

/**
 * Checks if a string is a palindrome (case-insensitive).
 */
function checkPalindrome(str: string): boolean {
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversed = normalized.split("").reverse().join("");
  return normalized === reversed;
}

/**
 * Counts words separated by whitespace.
 */
function countWords(str: string): number {
  const trimmed = str.trim();
  if (trimmed === "") {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

/**
 * Counts unique characters in a string.
 */
function countUniqueChars(str: string): number {
  return new Set(str).size;
}

/**
 * Generates a character frequency map.
 */
function getCharFrequency(str: string): Record<string, number> {
  return str.split("").reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Generates the SHA-256 hash of a string.
 */
function getSHA256(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 * Main function to analyze a string and compute all its properties.
 */
export function analyzeString(value: string): IStringProperties {
  return {
    length: value.length,
    is_palindrome: checkPalindrome(value),
    unique_characters: countUniqueChars(value),
    word_count: countWords(value),
    sha256_hash: getSHA256(value),
    character_frequency_map: getCharFrequency(value),
  };
}
