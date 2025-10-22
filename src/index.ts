import express from "express";
import connectDB from "./config/connectDb";
import stringRouter from "./modules/string-analyser/string-analyser.routes";
const app = express();
const PORT = 3000;
connectDB();
app.use(express.json());
app.use("/strings", stringRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
