import { Router } from "express";
import { StringAnalyserController } from "./string-analyser.controller";

const stringRouter = Router();

stringRouter.post("/", StringAnalyserController.createString);
stringRouter.get("/", StringAnalyserController.getAllStrings);
stringRouter.get(
  "/filter-by-natural-language",
  (req, res, next) => {
    console.log("Request URL:", req.url);
    console.log("Query parameters:", req.query);
    next();
  },
  StringAnalyserController.filterByNaturalLanguage
);
stringRouter.get("/:string_value", StringAnalyserController.getStringByValue);

stringRouter.delete("/:string_value", StringAnalyserController.deleteString);
export default stringRouter;
