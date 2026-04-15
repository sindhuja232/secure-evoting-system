import React, { useEffect, useState } from "react";

function VotingPage({ voterId }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/candidates/1")
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch(() => {
        setMessage("Failed to load candidates");
        setMessageType("error");
      });
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleVote = () => {
    if (!selectedCandidate) {
      setMessage("⚠️ Please select a candidate first");
      setMessageType("error");
      return;
    }

    fetch("http://127.0.0.1:5000/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voter_id: voterId,
        candidate_id: selectedCandidate.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVoteSubmitted(true);
        } else {
          setMessage(data.message || "Voting failed");
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Server error. Try again.");
        setMessageType("error");
      });
  };

  if (voteSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-700">
            ✅ Vote Successfully Cast!
          </h2>
          <p className="mt-4 text-gray-600">
            Thank you for participating.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      
      <h2 className="text-4xl font-extrabold text-center mb-6 text-blue-700">
        Electronic Ballot
      </h2>

      {/* MESSAGE BOX */}
      {message && (
        <div
          className={`max-w-xl mx-auto mb-6 text-center p-3 rounded-lg font-semibold ${
            messageType === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* CANDIDATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {candidates.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-xl shadow-md border-2 cursor-pointer hover:shadow-lg transition-all ${
              selectedCandidate?.id === c.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setSelectedCandidate(c)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-semibold">{c.name}</p>
                <p className="text-gray-600">{c.party_name}</p>
              </div>

              <img
                src={`http://127.0.0.1:5000/static/logos/${c.logo_url}`}
                alt="logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleVote}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}

export default VotingPage;