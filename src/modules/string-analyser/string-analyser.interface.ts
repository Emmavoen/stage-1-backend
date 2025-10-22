import type { Document } from "mongoose";

export interface IStringProperties {
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
}
export interface IStringAnalysis extends Document {
  id: string; // The SHA-256 hash
  value: string;
  properties: IStringProperties;
  created_at: Date;
}
