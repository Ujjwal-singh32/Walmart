"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
export default function AdminLoginAndRunner() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const pollingInterval = useRef(null);

  const handleRunScript = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/run-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setMessage(data.message || 'No response');
    setSuccess(data.success || false);

    if (data.success) {
      // Start polling status endpoint every 3 seconds
      pollingInterval.current = setInterval(checkScriptStatus, 3000);
    }
  };

const checkScriptStatus = async () => {
  const res = await fetch('/api/run-script');
  const status = await res.json();

  if (status.finished) {
    clearInterval(pollingInterval.current);

    // ✅ Replace the message with the final result
    setMessage(status.message); 
    setSuccess(status.success);
  }
};


  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(pollingInterval.current);
  }, []);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-orange-500 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="ml-2 text-2xl font-bold text-gray-800">Admin Script Runner</h1>
        </div>

        <form onSubmit={handleRunScript}>
          <div className="mb-4">
            
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center mb-4 p-2 rounded ${
                success ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Dispatch Shipments
          </button>

          <button
            className="w-full mt-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-100 font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            onClick={() => router.push(`/orders`)}
          >
            <svg
              className="w-5 h-5 mr-2 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 3h2l.4 2M7 13h10l1-5H6.4M7 13l-1.2 6H18M7 13L5 6H2" />
            </svg>
            Return to Orders
          </button>


        </form>

        <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-gray-600">
          <strong className="block font-medium text-gray-800 mb-1">Security Notice</strong>
          This is a secure admin area. All activities are logged and monitored for security purposes.
        </div>
      </div>
    </div>
  );
}
