import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import VotingPage from "./components/VotingPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [voterId, setVoterId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (isAdmin) return <AdminDashboard />;
  if (showAdminLogin) return <AdminLogin onAdminLogin={() => setIsAdmin(true)} />;
  if (voterId) return <VotingPage voterId={voterId} />;

  return (
    <div className="min-h-screen bg-gray-80">

      {/* HEADER */}
      <header className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">
          Secure E-Voting System
        </h1>

        <button
          onClick={() => setShowAdminLogin(true)}
          className="bg-white text-blue-700 px-4 py-2 rounded font-medium"
        >
          Admin Login
        </button>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto mt-10 px-4">

        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Electronic Voting Portal
        </h2>

        <p className="text-center text-gray-600 mt-2 mb-8">
          Secure biometric authentication to ensure reliable voting
        </p>

        {/* LOGIN CARD */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <LoginPage onLogin={(id) => setVoterId(id)} />
        </div>

      </div>

    </div>
  );
}

export default App;