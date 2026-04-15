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

      const response = await axios.get(API_BASE, {
        params: {
          startDate,
          endDate,
          percent: Number(minGrowth),
          type: mode,
        },
      });

      setData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("ERROR:", err);
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

  // ✅ Column ordering (symbol, sector first)
  const getOrderedKeys = () => {
    if (!data.length) return [];
    const keys = Object.keys(data[0]);
    return [
      "symbol",
      "sector",
      ...keys.filter((k) => k !== "symbol" && k !== "sector"),
    ];
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Stock Growth Analysis
          </h1>
          <p className="text-slate-500 mt-2">
            Analyze stocks based on growth percentage and date range
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Min Growth (%)
              </label>
              <input
                type="number"
                value={minGrowth}
                onChange={(e) => setMinGrowth(Number(e.target.value))}
                className="w-full border px-4 py-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-xl"
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchGrowthData}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl"
              >
                Fetch Data
              </button>
            </div>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white p-6 text-center rounded-xl">
            Loading...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {/* Table */}
        {!loading && data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-xl font-semibold">
                Analysis Results ({data.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    {getOrderedKeys().map((key) => (
                      <th key={key} className="px-6 py-4">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">

                      {getOrderedKeys().map((key, i) => {
                        const value = row[key];

                        return (
                          <td key={i} className="px-6 py-4">

                            {/* Growth styling */}
                            {key.toLowerCase().includes("growth") ? (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  Number(value) > 0
                                    ? "bg-green-100 text-green-700"
                                    : Number(value) < 0
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100"
                                }`}
                              >
                                {Math.round(Number(value))}%
                              </span>

                            /* Sector styling */
                            ) : key.toLowerCase() === "sector" ? (
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                {value || "N/A"}
                              </span>

                            /* Price rounding */
                            ) : key.toLowerCase().includes("close") ? (
                              Math.round(Number(value))

                            ) : (
                              value ?? "N/A"
                            )}

                          </td>
                        );
                      })}

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && data.length === 0 && !error && (
          <div className="bg-white p-10 text-center rounded-xl">
            No data loaded
          </div>
        )}

      </div>
    </div>
  );
};

export default Actions;