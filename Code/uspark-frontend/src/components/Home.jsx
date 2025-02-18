import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../UerRoleContext"; // Import the UserRoleContext
import '../css/Home.css' // Import your CSS file

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { setUserRole } = useUserRole(); // Access setUserRole from context

  useEffect(() => {
    if (isSignedIn) {
      navigate("/pat-dashboard"); // Default to doctor dashboard for demonstration
    }
  }, [isSignedIn, navigate]);

  const handleRoleSelection = (role) => {
    setUserRole(role); // Set the user role in context
    navigate("/pat-dashboard"); // Redirect to the home page or you can modify to open modal
  };

  return (
    <div className="home-container">
      <h1>Welcome! Please Sign In or Sign Up</h1>
      
      <div className="role-selection">
        <div className="role-box">
          <h2>I am a Doctor</h2>
          <SignInButton mode="modal" onClick={() => handleRoleSelection("doctor")}>
            <button>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal" onClick={() => handleRoleSelection("doctor")}>
            <button>Sign Up</button>
          </SignUpButton>
        </div>
        
        <div className="role-box">
          <h2>I am a Patient</h2>
          <SignInButton mode="modal" onClick={() => handleRoleSelection("patient")}>
            <button>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal" onClick={() => handleRoleSelection("patient")}>
            <button>Sign Up</button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
};

export default Home;
