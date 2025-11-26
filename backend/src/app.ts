import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import studentRoutes from "./routes/studentRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(bodyParser.json());

app.use("/api/students", studentRoutes);

// middleware bắt lỗi
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

export default app;
