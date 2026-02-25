// src/components/auth/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const api = import.meta.env.VITE_API_BASE_URL; 
const API_BASE = `${api}/api/auth`;

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  const url = isSignup ? `${API_BASE}/signup` : `${API_BASE}/signin`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const text = await res.text();

    if (res.ok) {
      // ✅ Save JWT token
      localStorage.setItem("token", text);

      // ✅ Save user info
      localStorage.setItem(
        "user",
        JSON.stringify({ username: form.username })
      );

      // ✅ Redirect to dashboard
      navigate("/");   // <-- change route if needed
    } else {
      setMessage(text);
    }
  } catch (err) {
    setMessage("❌ Error connecting to server!");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-gray-700 font-medium">{message}</p>
        )}

        <p className="mt-6 text-center text-sm">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
