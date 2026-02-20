import React, { useRef, useState } from "react";

function LoginPage({ onLogin }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [voterId, setVoterId] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraStarted(true);
  };

  const captureAndVerify = () => {
    if (!voterId) {
      alert("Enter Voter ID");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);

    setLoading(true);
    setConfidence(null);

    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("voter_id", voterId);
      formData.append("photo", blob, "capture.jpg");

      fetch("http://127.0.0.1:5000/verify_face", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);

          if (data.success) {
            setConfidence(data.confidence);
            setTimeout(() => {
              onLogin(data.voter_id);
            }, 1500);
          } else {
            alert(data.message);
          }
        });
    }, "image/jpeg");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-5xl grid grid-cols-2 gap-8">

        <div className="relative">
          <h2 className="text-xl font-bold mb-4 text-center">
            Face Verification
          </h2>

          <video
            ref={videoRef}
            autoPlay
            className="w-full rounded-lg border"
          />

          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
              Verifying Face...
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />

          <button
            onClick={startCamera}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
          >
            Start Camera
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">
            Secure Voter Authentication
          </h2>

          <input
            placeholder="Enter Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="border p-3 rounded-lg mb-4"
          />

          <button
            onClick={captureAndVerify}
            disabled={!cameraStarted || loading}
            className={`p-3 rounded-lg text-white font-semibold ${
              loading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Verify Face
          </button>

          {confidence !== null && (
            <p className="mt-4 text-sm text-gray-600">
              Match Score: {confidence.toFixed(3)}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default LoginPage;