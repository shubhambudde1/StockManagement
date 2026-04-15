import React, { useState } from "react";
import axios from "axios";

const apij = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 

const api = import.meta.env.VITE_API_BASE_PY_URL || "http://localhost:4000"; 
const API_BASE = `${api}/stocksC`;



const StockCompare = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [result, setResult] = useState(null);

  // 🔍 Search stocks
  const handleSearch = async (q) => {
    setQuery(q);

    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`${apij}/api/search?q=${q}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ Add stock
  const addStock = (stock) => {
    const symbol = stock[0];

    if (!selectedStocks.includes(symbol)) {
      setSelectedStocks([...selectedStocks, symbol]);
    }

    setSuggestions([]);
    setQuery("");
  };

  // ❌ Remove stock
  const removeStock = (symbol) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol));
  };

  // 📊 Compare stocks
  const compareStocks = async () => {
    try {
      const res = await axios.post(`${API_BASE}`, {
        stocks: selectedStocks,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h2>Stock Compare</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search stocks..."
        style={{ width: "100%", padding: "10px" }}
      />

      {/* 📋 Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ border: "1px solid #ccc" }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => addStock(s)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {s[0]} - {s[1]}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Selected Stocks */}
      <div style={{ marginTop: "10px" }}>
        {selectedStocks.map((stock) => (
          <span
            key={stock}
            style={{
              margin: "5px",
              padding: "5px 10px",
              background: "#ddd",
              display: "inline-block",
            }}
          >
            {stock}
            <button onClick={() => removeStock(stock)}>❌</button>
          </span>
        ))}
      </div>

      {/* 🚀 Compare Button */}
      <button
        onClick={compareStocks}
        disabled={selectedStocks.length === 0}
        style={{ marginTop: "10px" }}
      >
        Compare
      </button>

      {/* 📊 Result */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result</h3>
{result && (
  <div style={{ marginTop: "20px" }}>
    <h3>Comparison Table</h3>

    <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
      <thead>
        <tr>
          <th>Stock</th>
          <th>1D</th>
          <th>1W</th>
          <th>1M</th>
          <th>3M</th>
          <th>6M</th>
          <th>1Y</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(result).map(([stock, data]) => (
          <tr key={stock}>
            <td>{stock}</td>

            <td style={{ color: data["1d"] >= 0 ? "green" : "red" }}>
              {data["1d"] ?? "-"}%
            </td>

            <td style={{ color: data["1w"] >= 0 ? "green" : "red" }}>
              {data["1w"] ?? "-"}%
            </td>

            <td style={{ color: data["1m"] >= 0 ? "green" : "red" }}>
              {data["1m"] ?? "-"}%
            </td>

            <td style={{ color: data["3m"] >= 0 ? "green" : "red" }}>
              {data["3m"] ?? "-"}%
            </td>

            <td style={{ color: data["6m"] >= 0 ? "green" : "red" }}>
              {data["6m"] ?? "-"}%
            </td>

            <td style={{ color: data["1y"] >= 0 ? "green" : "red" }}>
              {data["1y"] ?? "-"}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}        </div>
      )}
    </div>
  );
};

export default StockCompare;