import React, { useRef, useState, useEffect } from "react";

function LoginPage({ onLogin }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [voterId, setVoterId] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraStarted(true);
    } catch {
      setMessage("❌ Unable to access camera");
      setMessageType("error");
    }
  };

  const captureAndVerify = () => {
    if (!voterId) {
      setMessage("⚠️ Please enter Voter ID");
      setMessageType("error");
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
            setMessage("✅ Face verified successfully");
            setMessageType("success");

            setTimeout(() => {
              onLogin(data.voter_id);
            }, 1500);
          } else {
            setMessage(`❌ ${data.message}`);
            setMessageType("error");
          }
        })
        .catch(() => {
          setLoading(false);
          setMessage("❌ Server error");
          setMessageType("error");
        });
    }, "image/jpeg");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl grid grid-cols-2 gap-8">

        {/* CAMERA */}
        <div className="relative">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center">
            Biometric Face Verification
          </h2>

          <video ref={videoRef} autoPlay className="w-full rounded-lg border" />

          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
              Verifying...
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />

          <button
            onClick={startCamera}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg w-full"
          >
            Start Camera
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
            Secure Voter Authentication
          </h2>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mb-4 text-center p-3 rounded-lg font-semibold ${
                messageType === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <input
            placeholder="Enter Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={captureAndVerify}
            disabled={!cameraStarted || loading}
            className={`p-3 rounded-lg text-white font-semibold ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-green-500 to-green-700"
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