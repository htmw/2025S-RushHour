require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const routes = require("./routes"); // Consolidated routes
const { swaggerUi, swaggerSpec } = require("./swagger"); // Swagger setup

// ✅ NEW: Import medseg route
const medsegRoutes = require("./routes/medseg"); // ⭐ ADDED THIS LINE

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Serve API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/", authRoutes);
app.use("/api", routes);

app.get("/test", (req, res) => {
  res.send("Hello Tester");
});

app.get("/health", (req, res) => {
  res.status(200).send("Backend is healthy!");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
