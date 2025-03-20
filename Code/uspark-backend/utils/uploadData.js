require("dotenv").config();

const { MongoClient } = require("mongodb");

// MongoDB Atlas connection string (Replace <username>, <password>, and <cluster_url>)
const uri = process.env.MONGO_URI;

// List of common health issues
const commonHealthIssues = [
  "Heart attack",
  "Alcoholic hepatitis",
  "Hepatitis C",
  "Hepatitis E",
  "Hepatitis D",
  "Tuberculosis",
  "Varicose veins",
  "Hypoglycemia",
  "Osteoarthritis",
  "Arthritis",
  "Pneumonia",
  "Common Cold",
  "Diabetes",
  "Prostate cancer",
  "Liver disease",
  "High blood pressure",
  "Stroke",
  "Gout",
  "Chronic obstructive pulmonary disease (COPD)",
  "Kidney stones",
  "Depression",
  "Anemia",
  "Sleep apnea",
  "Pancreatitis",
  "Gallstones",
  "Influenza",
  "Bronchitis",
  "GERD (Acid Reflux)",
  "Hypertension",
  "Colon cancer",
  "Testicular cancer",
  "Erectile dysfunction",
  "Urinary tract infection",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Psoriasis",
  "Acne",
  "(vertigo) Paroymsal  Positional Vertigo",
  "Fungal infection",
  "Dimorphic hemorrhoids (piles)",
  "Breast cancer",
  "Ovarian cancer",
  "Cervical cancer",
  "Endometriosis",
  "Polycystic Ovary Syndrome (PCOS)",
  "Menopause-related conditions",
  "Osteoporosis",
  "Fibromyalgia",
  "Iron-deficiency anemia",
  "Migraine",
  "Anxiety disorders",
  "Chronic fatigue syndrome",
  "Autoimmune diseases (Lupus, Rheumatoid Arthritis)",
  "Hormonal imbalance",
  "Urinary incontinence",
  "Pelvic inflammatory disease",
  "Heart disease (in women-specific cases)",
  "Headache",
  "Cold",
  "Fever",
  "Cough",
  "Allergies",
  "Back pain",
  "Obesity",
  "Indigestion",
  "Skin allergies",
  "Sinusitis",
  "Asthma",
  "Diarrhea",
  "Constipation",
  "Dehydration",
  "Tonsillitis",
  "Muscle cramps",
  "Eye infections",
  "Ear infections",
  "Dizziness",
  "Sore throat",
  "Nausea",
  "Food poisoning",
  "Insomnia",
  "Acid reflux",
  "Fatigue",
  "Body aches",
  "Vitamin deficiencies",
  "Tooth decay",
  "Gastritis",
  "Hemorrhoids",
  "Scalp infections",
  "Yeast infections",
  "Dry skin",
  "Eczema",
  "Sunburn",
  "High cholesterol",
  "Joint pain",
  "Menstrual cramps",
  "Hormonal imbalances",
  "Hair loss",
  "IBS (Irritable Bowel Syndrome)",
  "Hiccups",
];

async function insertData() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const collection = client.db("Uspark").collection("commonHealthIssues"); // Collection Name

    // Prepare data in the required format
    const documents = commonHealthIssues.map((issue) => ({
      health_issue: issue,
    }));

    // Insert into MongoDB
    const result = await collection.insertMany(documents);
    console.log(`Inserted ${result.insertedCount} health issues successfully.`);
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.close();
  }
}

// Run the function
insertData();
