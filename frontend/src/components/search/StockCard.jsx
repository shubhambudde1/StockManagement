import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StockCard = () => {
  const { symbol } = useParams();   // ✅ get symbol from URL
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  const api_base = import.meta.env.VITE_API_BASE_PY_URL;

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${api_base}/stock?symbol=${symbol}`);
        const data = await res.json();

        setStock(data);
      } catch (err) {
        console.error("Error fetching stock:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);   // ✅ depend on symbol, not API_URL

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!stock || stock.error)
    return <p className="text-center text-red-500">No data found</p>;

  const addToWatchlist = () => {
    navigate("/Watchlist", { state: stock });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-2">{stock.name}</h2>
      <p className="text-gray-600 mb-4">
        {stock.symbol} • {stock.exchange}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <p><strong>Current Price:</strong> ₹{stock.current_price_inr ?? "N/A"}</p>
        <p><strong>Day High:</strong> ₹{stock.day_high_inr ?? "N/A"}</p>
        <p><strong>Day Low:</strong> ₹{stock.day_low_inr ?? "N/A"}</p>
        <p><strong>52W High:</strong> ₹{stock["52_week_high_inr"] ?? "N/A"}</p>
        <p><strong>52W Low:</strong> ₹{stock["52_week_low_inr"] ?? "N/A"}</p>
        <p><strong>PE Ratio:</strong> {stock.pe_ratio ?? "N/A"}</p>
        <p><strong>Dividend Yield:</strong> {stock.dividend_yield ?? "N/A"}%</p>
        <p><strong>Volume:</strong> {stock.volume ? stock.volume.toLocaleString() : "N/A"}</p>
        <p><strong>Market Cap:</strong> {stock.market_cap_inr ? `₹${stock.market_cap_inr.toLocaleString()}` : "N/A"}</p>
        <p><strong>Industry:</strong> {stock.industry ?? "N/A"}</p>
        <p><strong>Sector:</strong> {stock.sector ?? "N/A"}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
          Buy
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Sell
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={addToWatchlist}
        >
          Add to Watchlist
        </button>
      </div>
    </div>
  );
};

export default StockCard;