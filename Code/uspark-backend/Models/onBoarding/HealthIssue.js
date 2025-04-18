const mongoose = require("mongoose");

const HealthIssueSchema = new mongoose.Schema(
  {
    health_issue: { type: String, required: true, unique: true },
  },
  { collection: "commonHealthIssues" }
);

module.exports = mongoose.model("commonHealthIssues", HealthIssueSchema);
