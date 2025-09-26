import express from "express";
import config from "./config/config";
import authRoutes from "./routes/authRoutes";
import businessRoutes from "./routes/businessRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);

//health check endpoint
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Log the loaded auth routes
console.log("Loaded auth routes:", authRoutes.stack.map((r: any) => r.route?.path));

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error stack:", err.stack);
    console.error("Error message:", err.message);
    res.status(500).json({
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
