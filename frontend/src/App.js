import React, { useState } from "react";
import VotingPage from "./components/VotingPage";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [voterId, setVoterId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-6">
        Secure E-Voting System
      </h1>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAdmin(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Admin View
        </button>
      </div>

      {!voterId ? (
        <LoginPage onLogin={setVoterId} />
      ) : (
        <VotingPage voterId={voterId} />
      )}
    </div>
  );
}

export default App;
