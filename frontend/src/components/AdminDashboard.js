import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);

  const fetchResults = () => {
    fetch("http://127.0.0.1:5000/api/results")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server not reachable");
        }
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setError(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    fetchResults();

    const interval = setInterval(() => {
      fetchResults();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl text-red-600">
          Unable to connect to backend server.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-4xl font-bold text-center mb-8">
        Live Election Results
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border"
          >
            <div>
              <p className="text-lg font-semibold">{r.candidate_name}</p>
              <p className="text-gray-600">{r.party_name}</p>
            </div>

            <div className="text-2xl font-bold text-blue-600">
              {r.votes} Votes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
