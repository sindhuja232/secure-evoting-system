import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [results, setResults] = useState([]);

  const fetchResults = () => {
    fetch("http://127.0.0.1:5000/api/results")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.votes - a.votes);
        setResults(sorted);
      });
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, []);

  if (results.length === 0) {
    return <div className="text-center mt-10 text-xl">No results yet</div>;
  }

  const winner = results[0];

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-4xl font-bold text-center mb-8">
        Live Election Results
      </h1>

      {/* Winner */}
      <div className="bg-green-100 border-2 border-green-500 p-6 rounded-xl text-center mb-8">
        <h2 className="text-xl font-bold text-green-700">
            Leading Candidate
        </h2>
        <p className="text-lg font-semibold">{winner.candidate_name}</p>
        <p>{winner.party_name}</p>
        <p className="text-2xl font-bold text-green-700">
          {winner.votes} Votes
        </p>
      </div>

      {/* All Candidates */}
      <div className="max-w-3xl mx-auto space-y-4">
        {results.map((r, i) => (
          <div key={i} className="flex justify-between bg-white p-5 rounded-lg shadow">
            <div>
              <p className="font-bold">
                #{i + 1} {r.candidate_name}
              </p>
              <p className="text-gray-600">{r.party_name}</p>
            </div>
            <div className="font-bold text-blue-600">
              {r.votes} Votes
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminDashboard;