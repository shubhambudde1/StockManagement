import React, { useState, useEffect } from "react";
import screenerImage from "/screener.png"; // Correct way to import image from public/

function General() {
  const [indices, setIndices] = useState({});
  const [sectors, setSectors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSectorsModal, setShowSectorsModal] = useState(false);

  const STOCKS = [
    { symbol: "TCS", name: "Tata Consultancy", vol: "2.4M" },
    { symbol: "INFY", name: "Infosys", vol: "3.1M" },
    { symbol: "RELIANCE", name: "Reliance", vol: "1.9M" },
    { symbol: "HDFC", name: "HDFC Bank", vol: "1.2M" },
  ];

  const apiBase = import.meta.env.VITE_API_BASE_PY_URL;
  const API_URL = apiBase ? `${apiBase}/indexes` : null;
  const api_allSecters = apiBase ? `${apiBase}/all_indices` : null;

  useEffect(() => {
    // Load cached data first
    const saved = localStorage.getItem("indices");
    const savedSectors = localStorage.getItem("sectors");
    if (saved) {
      setIndices(JSON.parse(saved));
      setLoading(false);
    }
    if (savedSectors) {
      setSectors(JSON.parse(savedSectors));
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
      }

      // Fetch sectors data
      try {
        const sectorRes = await fetch(api_allSecters);
        if (!sectorRes.ok) throw new Error(`HTTP ${sectorRes.status}`);
        const sectorData = await sectorRes.json();

        setSectors(sectorData);
        localStorage.setItem("sectors", JSON.stringify(sectorData));
      } catch (error) {
        console.error("Error fetching sectors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, api_allSecters]);

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
          <div className="bg-white rounded-md p-3 shadow-sm border-black/10 border mb-4">
            <a href="https://www.screener.in/"       >
            <img
              src={screenerImage}
              alt="Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            </a>
          </div>
          <div className="m-2 p-4 border-black/10 border rounded-md bg-white/80 shadow-sm">
<a href="https://www.tickertape.in/"       >
           <h2 className="text-2xl font-bold text-center text-slate-800">TickerTape</h2>
            </a>
          </div>
            
        
        </div>

          


        {/* Right Sidebar */}
        <aside className="w-full md:w-72 space-y-4">

          {/* Indices Section */}
          <div className="bg-white rounded-md p-3 shadow-sm">
            <h4 className="font-semibold mb-3">Indices</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-semibold pb-2 px-2">Index</th>
                  <th className="text-right font-semibold pb-2 px-2">Latest</th>
                  <th className="text-right font-semibold pb-2 px-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(indices).map(([name, data]) => (
                  <tr key={name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="font-medium py-2 px-2">{name}</td>
                    <td className="text-right text-slate-600 py-2 px-2">
                      {data?.latest
                        ? data.latest.toLocaleString()
                        : "N/A"}
                    </td>
                    <td
                      className={`text-right py-2 px-2 ${
                        (data?.["daily_change_%"] ?? 0) >= 0
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }`}
                    >
                      {data?.["daily_change_%"] !== undefined
                        ? formatChange(data["daily_change_%"])
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View Sectors Button */}
          <button
            onClick={() => setShowSectorsModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md shadow-sm transition"
          >
            View Sectors
          </button>

        </aside>
      </div>

      {/* Sectors Modal */}
      {showSectorsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSectorsModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Sectors</h2>
              <button
                onClick={() => setShowSectorsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left font-semibold py-3 px-4">Sector</th>
                      <th className="text-right font-semibold py-3 px-4">Latest</th>
                      <th className="text-right font-semibold py-3 px-4">1D</th>
                      <th className="text-right font-semibold py-3 px-4">1W</th>
                      <th className="text-right font-semibold py-3 px-4">1M</th>
                      <th className="text-right font-semibold py-3 px-4">6M</th>
                      <th className="text-right font-semibold py-3 px-4">1Y</th>
                      <th className="text-right font-semibold py-3 px-4">5Y</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sectors).map(([name, data]) => (
                      <tr key={name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="font-medium py-3 px-4">{name}</td>
                        <td className="text-right text-slate-600 py-3 px-4">
                          {data?.latest
                            ? data.latest.toLocaleString()
                            : "N/A"}
                        </td>
                        <td
                          className={`text-right py-3 px-4 font-semibold ${
                            (data?.["daily_change_%"] ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.["daily_change_%"] !== undefined
                            ? formatChange(data["daily_change_%"])
                            : "N/A"}
                        </td>
                        <td
                          className={`text-right py-3 px-4 font-semibold ${
                            (data?.["1w_change_%"] ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.["1w_change_%"] !== undefined
                            ? formatChange(data["1w_change_%"])
                            : "N/A"}
                        </td>
                        <td
                          className={`text-right py-3 px-4 font-semibold ${
                            (data?.["1m_change_%"] ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.["1m_change_%"] !== undefined
                            ? formatChange(data["1m_change_%"])
                            : "N/A"}
                        </td>
                        <td
                          className={`text-right py-3 px-4 font-semibold ${
                            (data?.["6m_change_%"] ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.["6m_change_%"] !== undefined
                            ? formatChange(data["6m_change_%"])
                            : "N/A"}
                        </td>
                        <td
                          className={`text-right py-3 px-4 font-semibold ${
                            (data?.["1y_change_%"] ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.["1y_change_%"] !== undefined
                            ? formatChange(data["1y_change_%"])
                            : "N/A"}
                        </td>
                        <td
                          className={`text-right py-3 px-4 font-semibold ${
                            (data?.["5y_change_%"] ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.["5y_change_%"] !== undefined
                            ? formatChange(data["5y_change_%"])
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default General;
