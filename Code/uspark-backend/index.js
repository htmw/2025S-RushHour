require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./routes"); // Import the consolidated routes

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Generate JWT Token

app.use("/", authRoutes);

app.use("/api", routes);

app.get("/test", (req, res) => {
  res.send("Hello Tester");
});
// ✅ Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
