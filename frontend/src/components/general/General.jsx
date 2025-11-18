import React, { useState, useEffect } from "react";
import screenerImage from "/screener.png"; // Correct way to import image from public/

function General() {
  const [indices, setIndices] = useState({});
  const [loading, setLoading] = useState(true);

  const STOCKS = [
    { symbol: "TCS", name: "Tata Consultancy", vol: "2.4M" },
    { symbol: "INFY", name: "Infosys", vol: "3.1M" },
    { symbol: "RELIANCE", name: "Reliance", vol: "1.9M" },
    { symbol: "HDFC", name: "HDFC Bank", vol: "1.2M" },
  ];

  const apiBase = import.meta.env.VITE_API_BASE_PY_URL;
  const API_URL = apiBase ? `${apiBase}/indexes` : null;

  useEffect(() => {
    // Load cached data first
    const saved = localStorage.getItem("indices");
    if (saved) {
      setIndices(JSON.parse(saved));
      setLoading(false);
    }

    // Fetch fresh data
    const fetchData = async () => {
      if (!API_URL) {
        console.error("API URL missing");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setIndices(data);
        localStorage.setItem("indices", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching indices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const formatChange = (value) => {
    return value !== undefined
      ? `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
      : "N/A";
  };

  if (loading && Object.keys(indices).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Left Section */}
        <div>
          <div className="bg-white rounded-md p-3 shadow-sm">
            <a href="https://www.screener.in/"       >
            <img
              src={screenerImage}
              alt="Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            </a>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full md:w-72 space-y-4">

          {/* Indices Section */}
          <div className="bg-white rounded-md p-3 shadow-sm">
            <h4 className="font-semibold mb-3">Indices</h4>
            <div className="space-y-2">
              {Object.entries(indices).map(([name, data]) => (
                <div key={name} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-slate-500">
                      {data?.latest
                        ? data.latest.toLocaleString()
                        : "N/A"}
                    </div>
                  </div>

                  <div
                    className={`text-sm ${
                      (data?.["daily_change_%"] ?? 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {data?.["daily_change_%"] !== undefined
                      ? formatChange(data["daily_change_%"])
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Movers */}
          <div className="bg-white rounded-md p-3 shadow-sm">
            <h4 className="font-semibold mb-2">Market Movers</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {STOCKS.map((s) => (
                <li
                  key={s.symbol}
                  className="flex items-center justify-between"
                >
                  <div>{s.symbol}</div>
                  <div className="text-xs text-slate-500">{s.vol}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sponsored */}
          <div className="bg-white rounded-md p-3 shadow-sm">
            <h4 className="font-semibold mb-2">Sponsored</h4>
            <div className="text-sm text-slate-500">
              Ad / partner content can go here.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default General;
