import { model, Schema } from "mongoose";
import type { IStringAnalysis } from "./string-analyser.interface";

const StringAnalyserSchema: Schema<IStringAnalysis> = new Schema({
  id: { type: String, required: true, unique: true }, // SHA-256 hash
  value: { type: String, required: true },
  properties: {
    length: { type: Number, required: true },
    is_palindrome: { type: Boolean, required: true },
    unique_characters: { type: Number, required: true },
    word_count: { type: Number, required: true },
    sha256_hash: { type: String, required: true },
    character_frequency_map: { type: Map, of: Number, required: true },
  },
  created_at: { type: Date, default: Date.now },
});

StringAnalyserSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    if (ret) {
      delete ret._id;
      delete ret.__v;
    }
    return ret;
  },
});

const StringAnalyser = model<IStringAnalysis>(
  "StringAnalyser",
  StringAnalyserSchema
);
export default StringAnalyser;
