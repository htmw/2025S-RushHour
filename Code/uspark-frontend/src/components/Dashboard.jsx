import { SignOutButton } from "@clerk/clerk-react";

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <SignOutButton>
        <button>Logout</button>
      </SignOutButton>
    </div>
  );
};

export default Dashboard;
