import React, { useEffect, useState } from "react";

function VotingPage({ voterId }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/candidates/1")
      .then((res) => res.json())
      .then((data) => setCandidates(data));
  }, []);

  const handleVote = () => {
    if (!selectedCandidate) {
      alert("Select a candidate first");
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
          alert(data.message);
        }
      });
  };

  if (voteSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-700">
            Vote Successfully Cast!
          </h2>
          <p className="mt-4 text-gray-600">
            Thank you for participating in the election.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Electronic Ballot Paper
      </h2>

      <div className="max-w-2xl mx-auto space-y-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCandidate(c)}
            className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedCandidate?.id === c.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <div>
              <p className="text-lg font-semibold">{c.name}</p>
              <p className="text-gray-600">{c.party_name}</p>
            </div>

            <img
              src={`http://127.0.0.1:5000/static/logos/${c.logo_url}`}
              alt="logo"
              className="w-14 h-14 object-contain"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleVote}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
        >
          Submit Your Vote
        </button>
      </div>
    </div>
  );
}

export default VotingPage;
