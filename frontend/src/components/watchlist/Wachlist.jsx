import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const api_base1 = import.meta.env.VITE_API_BASE_PY_URL;

export default function Watchlist() {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [stocks, setStocks] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState(""); // ✅ symbol search input
  const [loading, setLoading] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false); // ✅ renamed to camelCase

  // ✅ new states for Buy/Sell popup
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState(""); // "BUY" or "SELL"
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [suggestions, setSuggestions] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [stopLoss, setStopLoss] = useState("");
const [targetPrice, setTargetPrice] = useState("");

  // ✅ Fetch watchlists
  const fetchWatchlists = async () => {
    const res = await axios.get(`${API_BASE}/watchlists`);
    setWatchlists(res.data);
  };

  // ✅ Fetch stocks for selected watchlist
  const fetchStocks = async (watchlistId) => {
    const res = await axios.get(`${API_BASE}/watchlists/${watchlistId}/stocks`);
    setStocks(res.data);
  };

  // ✅ Create watchlist
  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) return;
    await axios.post(`${API_BASE}/watchlists`, { name: newWatchlistName });
    setNewWatchlistName("");
    fetchWatchlists();
  };

  // ✅ Delete watchlist
  const handleDeleteWatchlist = async (id) => {
    await axios.delete(`${API_BASE}/watchlists/${id}`);
    if (selectedWatchlist === id) {
      setSelectedWatchlist(null);
      setStocks([]);
    }
    fetchWatchlists();
  };

  // ✅ Handle Buy/Sell action
const handleBuySell = (stock, type) => {
  setSelectedStock(stock);
  setTransactionType(type);
  setPrice(stock.currentPriceInr.toString());
  setStopLoss("");       // reset
  setTargetPrice("");    // reset
  setShowModal(true);
};

  // ✅ Search stock by symbol and save automatically
 const handleSearchStock = async (value) => {
  setSearchSymbol(value);

  if (value.trim().length === 0) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }

  try {
    const res = await axios.get(
      `${API_BASE}/watchlists/${selectedWatchlist}/stocks/search?q=${value}`
    );

    setSuggestions(res.data);
    setShowDropdown(true);
  } catch (err) {
    console.error("Search error", err);
  }
};

const handleAddStock = async (symbol) => {
  if (!selectedWatchlist) return alert("Select a watchlist first");

  try {
    const res = await fetch(`${api_base1}/stock?symbol=${symbol}`);
    const data = await res.json();

    const stockPayload = {
      name: data.name || symbol,
      symbol: data.symbol || symbol,
      currentPriceInr: data.current_price_inr || data.price || 0,
      marketCapInr: data.market_cap_inr || 0,
      peRatio: data.pe_ratio || 0,
      industry: data.industry || "N/A",
      volume: data.volume || 0,
    };

    await axios.post(
      `${API_BASE}/watchlists/${selectedWatchlist}/stocks`,
      stockPayload
    );

    fetchStocks(selectedWatchlist);
    setSearchSymbol("");
    setShowDropdown(false);
  } catch (err) {
    console.error("Add stock failed", err);
  }
};
  useEffect(() => {
    fetchWatchlists();
  }, []);

const handleTransactionSubmit = async () => {
  if (!selectedStock || !quantity || !price)
    return alert("Enter all details");

  try {
    const payload = {
      user: { id: 1 },
      stock: { id: selectedStock.id },
      quantity: parseFloat(quantity),
      avgPrice: parseFloat(price),
      transactionType,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      targetPrice: targetPrice ? parseFloat(targetPrice) : null,
    };

    await axios.post(`${API_BASE}/portfolios`, payload);

    alert(`${transactionType} successful!`);
    setShowModal(false);

    // reset
    setQuantity("");
    setPrice("");
    setStopLoss("");
    setTargetPrice("");
  } catch (err) {
    console.error("Transaction failed", err);
    alert("Failed to record transaction");
  }
};

  return (
    <div className="p-2 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">📊 Watchlist Manager</h1>

      {/* Watchlist Section */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold mb-2">
          Watchlists{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setShowWatchlist(!showWatchlist)}
          >
            add
          </span>
        </h2>

        <div className="flex gap-2 mb-1">
          {showWatchlist && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Watchlist Name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                className="border p-2 rounded w-60"
              />
              <button
                onClick={handleCreateWatchlist}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>

        <ul className="space-y-2 flex">
          {watchlists.map((w) => (
            <li
              key={w.id}
              className={`p-2 border rounded flex justify-between items-center cursor-pointer w-60 m-2 ${
                selectedWatchlist === w.id ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => {
                setSelectedWatchlist(w.id);
                fetchStocks(w.id);
              }}
            >
              <span>{w.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWatchlist(w.id);
                }}
                className="bg-red-500 text-white px-1 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Stocks Section */}
      {selectedWatchlist && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Stocks in Watchlist</h2>

          {/* ✅ Search by Symbol */}
          <div className="flex gap-2 mb-3 relative">
  <input
    type="text"
    placeholder="Search stock (RELIANCE, TCS...)"
    value={searchSymbol}
    onChange={(e) => handleSearchStock(e.target.value)}
    className="border p-2 rounded w-60"
  />

  {showDropdown && suggestions.length > 0 && (
    <div className="absolute top-12 w-60 bg-white border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
      {suggestions.map((item, index) => (
        <div
          key={index}
          onClick={() => handleAddStock(item[0])}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <div className="font-semibold">{item[0]}</div>
          <div className="text-xs text-gray-500">{item[1]}</div>
        </div>
      ))}
    </div>
  )}
</div>

          {/* Stock Table */}
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Symbol</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">PE Ratio</th>
                <th className="border px-2 py-1">Industry</th>
                <th className="border px-2 py-1">Volume</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.name}</td>
                  <td className="border px-2 py-1">{s.symbol}</td>
                  <td className="border px-2 py-1">₹{s.currentPriceInr}</td>
                  <td className="border px-2 py-1">{s.peRatio}</td>
                  <td className="border px-2 py-1">{s.industry}</td>
                  <td className="border px-2 py-1">{s.volume}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      onClick={() => handleBuySell(s, "BUY")}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleBuySell(s, "SELL")}
                      className="bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Sell
                    </button>
                    <button
                      onClick={() =>
                        axios
                          .delete(
                            `${API_BASE}/watchlists/${selectedWatchlist}/stocks/${s.id}`
                          )
                          .then(() => fetchStocks(selectedWatchlist))
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {stocks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-gray-500">
                    No stocks in this watchlist
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Buy/Sell Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-5 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-3">
                  {transactionType} - {selectedStock?.name} (
                  {selectedStock?.symbol})
                </h2>
              <input
  type="number"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
  className="border p-2 rounded w-full mb-2"
/>

<input
  type="number"
  placeholder="Price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  className="border p-2 rounded w-full mb-2"
/>

{/* ✅ NEW */}
<input
  type="number"
  placeholder="Stop Loss (optional)"
  value={stopLoss}
  onChange={(e) => setStopLoss(e.target.value)}
  className="border p-2 rounded w-full mb-2"
/>

<input
  type="number"
  placeholder="Target Price (optional)"
  value={targetPrice}
  onChange={(e) => setTargetPrice(e.target.value)}
  className="border p-2 rounded w-full mb-2"
/>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransactionSubmit}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
