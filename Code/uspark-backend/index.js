require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const onBoardingRoutes = require("./routes/onboarding");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const profileImage = require("./routes/profileimage");
const insuranceRoutes = require("./routes/Insuranceroutes");
const app = express();
const PORT = process.env.PORT || 5000;
const adminRoutes = require("./routes/admin"); //  Import Admin Routes
const Chat = require("./routes/chat");









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
app.use("/api", onBoardingRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", profileImage);
app.use("/api/admin", adminRoutes); 
app.use("/api", insuranceRoutes);
app.use("/api", Chat); 


app.get("/test", (req, res) => {
  res.send("Hello Tester");
});
// ✅ Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
