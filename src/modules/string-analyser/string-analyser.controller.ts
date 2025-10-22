import type { Request, Response } from "express";
import StringAnalyser from "./string-analyser.model";
import type {
  IStringAnalysis,
  IStringProperties,
} from "./string-analyser.interface";
import { analyzeString } from "./string-analyser.service";

export class StringAnalyserController {
  static async createString(req: Request, res: Response) {
    try {
      const { value } = req.body;
      if (!value || !req.body) {
        return res.status(400).json("Invalid  request: 'value' is required");
      }
      if (typeof value !== "string") {
        return res
          .status(422)
          .json("Invalid request: 'value' must be a string");
      }
      const existing = await StringAnalyser.findOne({ value });
      if (existing) {
        return res.status(409).json("String already exists in the system");
      }
      const properties: IStringProperties = analyzeString(value);

      const newString = new StringAnalyser({
        id: properties.sha256_hash,
        value,
        properties,
      });
      await newString.save();
      res.status(201).json(newString);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getStringByValue(req: Request, res: Response) {
    try {
      const { string_value } = req.params;
      console.log(string_value);
      const analysis = await StringAnalyser.findOne({ value: string_value });
      if (!analysis) {
        return res
          .status(404)
          .json({ message: "String does not exist in the system" });
      }

      res.status(200).json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static getAllStrings = async (req: Request, res: Response) => {
    try {
      const allowedParams = [
        "is_palindrome",
        "min_length",
        "max_length",
        "word_count",
        "contains_character",
      ];
      const receivedParams = Object.keys(req.query);
      const invalidParams = receivedParams.filter(
        (p) => !allowedParams.includes(p)
      );

      if (invalidParams.length > 0) {
        return res.status(400).json({
          message: `Invalid query parameter(s): ${invalidParams.join(", ")}`,
        });
      }
      const {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
      } = req.query;
      const filters: any = {};

      // Build the Mongoose query object dynamically
      if (is_palindrome !== undefined) {
        if (is_palindrome !== "true" && is_palindrome !== "false") {
          return res.status(400).json({
            message:
              "Invalid query parameter: is_palindrome must be true or false",
          });
        }
        filters["properties.is_palindrome"] = is_palindrome;
      }

      if (word_count !== undefined) {
        const wc = parseInt(word_count as string);
        if (isNaN(wc)) {
          return res.status(400).json({
            message: "Invalid query parameter: word_count must be an integer",
          });
        }
        filters["properties.word_count"] = wc;
      }

      // Handle length range
      const lengthFilter: any = {};
      if (min_length !== undefined) {
        const min = parseInt(min_length as string);
        if (isNaN(min)) {
          return res.status(400).json({
            message: "Invalid query parameter: min_length must be an integer",
          });
        }
        lengthFilter.$gte = min;
      }
      if (max_length !== undefined) {
        const max = parseInt(max_length as string);
        if (isNaN(max)) {
          return res.status(400).json({
            message: "Invalid query parameter: max_length must be an integer",
          });
        }
        lengthFilter.$lte = max;
      }
      if (Object.keys(lengthFilter).length > 0) {
        filters["properties.length"] = lengthFilter;
      }

      if (contains_character !== undefined) {
        if (typeof contains_character !== "string") {
          return res.status(400).json({
            message:
              "Invalid query parameter: contains_character must be a string",
          });
        }
        // Use regex for case-insensitive search
        filters.value = { $regex: contains_character, $options: "i" };
      }

      const results = await StringAnalyser.find(filters);

      return res.status(200).json({
        data: results,
        count: results.length,
        filters_applied: req.query,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  static async filterByNaturalLanguage(req: Request, res: Response) {
    try {
      console.log("entering natural language filter");
      const { query } = req.query;
      console.log(query);

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          message: 'Bad Request: Missing or invalid "query" parameter',
        });
      }

      const lowerQuery = query.toLowerCase();
      const parsed_filters: any = {};
      const mongoQuery: any = {};

      // Simple keyword-based parsing (as required by the examples)
      if (lowerQuery.includes("palindromic")) {
        parsed_filters.is_palindrome = true;
        mongoQuery["properties.is_palindrome"] = true;
      }

      if (lowerQuery.includes("single word")) {
        parsed_filters.word_count = 1;
        mongoQuery["properties.word_count"] = 1;
      }

      const lengthMatch = lowerQuery.match(/longer than (\d+) characters/);
      if (lengthMatch && lengthMatch[1]) {
        const min = parseInt(lengthMatch[1]);
        parsed_filters.min_length = min + 1; // "longer than 10" means 11+
        mongoQuery["properties.length"] = { $gte: min + 1 };
      }

      const containsMatch = lowerQuery.match(
        /containing the letter "([a-z])"/i
      );
      if (containsMatch && containsMatch[1]) {
        parsed_filters.contains_character = containsMatch[1];
        mongoQuery.value = { $regex: containsMatch[1], $options: "i" };
      } else if (lowerQuery.includes("first vowel")) {
        parsed_filters.contains_character = "a";
        mongoQuery.value = { $regex: "a", $options: "i" };
      } else if (lowerQuery.includes("letter z")) {
        parsed_filters.contains_character = "z";
        mongoQuery.value = { $regex: "z", $options: "i" };
      }

      // Check for conflicting filters (example)
      if (
        parsed_filters.min_length &&
        parsed_filters.max_length &&
        parsed_filters.min_length > parsed_filters.max_length
      ) {
        return res.status(422).json({
          message: "Query parsed but resulted in conflicting filters",
        });
      }

      const results = await StringAnalyser.find(mongoQuery);

      return res.status(200).json({
        data: results,
        count: results.length,
        interpreted_query: {
          original: query,
          parsed_filters: parsed_filters,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  static deleteString = async (req: Request, res: Response) => {
    try {
      const { string_value } = req.params;
      const result = await StringAnalyser.findOneAndDelete({
        value: string_value,
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: "String does not exist in the system" });
      }

      // 204 No Content
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
}
