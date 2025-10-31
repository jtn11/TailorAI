import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("backend server started ");
});

app.use("/dashboard", analysisRoutes);
