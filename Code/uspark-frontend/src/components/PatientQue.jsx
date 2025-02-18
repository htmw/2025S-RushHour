import React, { useState } from "react";
import Lottie from "lottie-react";
import childMale from "../../animations/child_male.json";
import childFemale from "../../animations/child_female.json";
import teenMale from "../../animations/teen_male.json";
import teenFemale from "../../animations/teen_female.json";
import adultMale from "../../animations/adult_male.json";
import adultFemale from "../../animations/adult_female.json";
import elderlyMale from "../../animations/elderly_male.json";
import elderlyFemale from "../../animations/elderly_female.json";
import neutral from "../../animations/neutral.json"; // Default animation
import "../css/PatientQue.css";
import { SignOutButton } from "@clerk/clerk-react";


const Questionnaire = () => {
  const [formData, setFormData] = useState({
    name: "", // Add name field
    age: "",
    sex: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to get animation based on age and gender
  const getAnimation = () => {
    const age = parseInt(formData.age);
    const sex = formData.sex;

    if (!age || !sex) return neutral; // Show default animation if no input

    if (age < 10) return sex === "male" ? childMale : childFemale;
    if (age >= 10 && age < 21) return sex === "male" ? teenMale : teenFemale;
    if (age >= 21 && age < 50) return sex === "male" ? adultMale : adultFemale;
    return sex === "male" ? elderlyMale : elderlyFemale;
  };

  return (
    <div className="questionnaire-wrapper">
      <div className="questionnaire-container">
        <h2>Health Questionnaire</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Sex</label>
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Height (cm)</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
        </div>
        <button>Submit</button>
        
      </div>

      {/* Animation Section */}
      <div className="animation-container">
        <Lottie animationData={getAnimation()} loop={true} />
      </div>
      <SignOutButton>
        <button style={{ margin: "10px", padding: "10px" }}>Logout</button>
      </SignOutButton>
    </div>
  );
};

export default Questionnaire;
