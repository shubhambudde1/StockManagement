import React, { useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_BASE = `${api}/api/stocks/growth`;

const Actions = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-11-28");
  const [minGrowth, setMinGrowth] = useState(50);
  const [mode, setMode] = useState("positive");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("API BASE:", API_BASE);
      console.log("Sending Params:", {
        startDate,
        endDate,
        percent: Number(minGrowth),
        type: mode,
      });

      const response = await axios.get(API_BASE, {
        params: {
          startDate,
          endDate,
          percent: Number(minGrowth),
          type: mode,
        },
      });

      console.log("Response:", response.data);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("FULL AXIOS ERROR:", err);
      console.error("BACKEND ERROR:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to fetch growth data"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Stock Growth Analysis
          </h1>
          <p className="text-slate-500 mt-2">
            Analyze stocks based on growth percentage and date range
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Min Growth (%)
              </label>
              <input
                type="number"
                value={minGrowth}
                onChange={(e) => setMinGrowth(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter %"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchGrowthData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow"
              >
                Fetch Data
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-blue-600 font-semibold text-lg">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 mb-6">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {!loading && data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">
                Analysis Results
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Total Records: {data.length}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="px-6 py-4 font-semibold whitespace-nowrap">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      {Object.entries(row).map(([key, value], i) => (
                       <td key={i} className="px-6 py-4 whitespace-nowrap text-slate-700">
  {key.toLowerCase().includes("growth") ? (
    <span
      className={`font-semibold px-3 py-1 rounded-full text-xs ${
        Number(value) > 0
          ? "bg-green-100 text-green-700"
          : Number(value) < 0
          ? "bg-red-100 text-red-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {Math.round(Number(value))}%
    </span>
  ) : key.toLowerCase() === "start_close" || key.toLowerCase() === "end_close" ? (
    Math.round(Number(value))
  ) : (
    value ?? "N/A"
  )}
</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && data.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-slate-500 text-lg">
              No data loaded yet. Select filters and click{" "}
              <span className="font-semibold text-blue-600">Fetch Data</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;