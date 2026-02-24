import React, { useEffect, useState } from "react";
import axios from "axios";

const NseTopStocks = () => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Works for both Vite and Create React App
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY || "";

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const options = {
        method: "GET",
        url: "https://latest-stock-price.p.rapidapi.com/any",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format from API");
      }

      // Sort by percentage change
      const sorted = data.sort((a, b) => b.pChange - a.pChange);
      setGainers(sorted.slice(0, 10));
      setLosers(sorted.slice(-10).reverse());
    } catch (err) {
      console.error("Error fetching data:", err);

      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          setError("❌ Unauthorized — Check your RapidAPI key.");
        } else if (status === 429) {
          setError("⚠️ Too many requests — wait a few seconds and retry.");
        } else {
          setError(`⚠️ Error ${status}: ${err.response.statusText}`);
        }
      } else {
        setError("Network error or invalid API setup.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Optional: auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Loading data...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        NSE Top Gainers & Losers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Top Gainers */}
        <div className="border rounded-xl p-4 shadow-md bg-green-50">
          <h2 className="text-xl font-semibold mb-3 text-green-700">
            📈 Top Gainers
          </h2>
          {gainers.map((stock, i) => (
            <div
              key={i}
              className="flex justify-between py-1 border-b border-green-200"
            >
              <span>{stock.symbol}</span>
              <span className="text-green-700 font-medium">
                +{stock.pChange}%
              </span>
            </div>
          ))}
        </div>

        {/* Top Losers */}
        <div className="border rounded-xl p-4 shadow-md bg-red-50">
          <h2 className="text-xl font-semibold mb-3 text-red-700">
            📉 Top Losers
          </h2>
          {losers.map((stock, i) => (
            <div
              key={i}
              className="flex justify-between py-1 border-b border-red-200"
            >
              <span>{stock.symbol}</span>
              <span className="text-red-700 font-medium">{stock.pChange}%</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Data updates every 60 seconds (via RapidAPI)
      </p>
    </div>
  );
};

export default NseTopStocks;
