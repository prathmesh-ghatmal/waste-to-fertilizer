import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import wasteListingRoutes from "./routes/wasteListing.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/waste", wasteListingRoutes);
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

export default app;
