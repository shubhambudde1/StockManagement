import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_BASE_PY_URL =
  import.meta.env.VITE_API_BASE_PY_URL || "http://localhost:4000";

const API_URL = `${API_BASE_URL}/api/portfolios`;
const PRICE_API = `${API_BASE_PY_URL}/api/current-prices`;
const HISTORY_API = `${API_BASE_URL}/api/transaction-history`;

export default function CurrentPriceTable() {
  const [portfolio, setPortfolio] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [activeTab, setActiveTab] = useState("portfolio");
  const [displayedHistoryCount, setDisplayedHistoryCount] = useState(10);

  /* ==============================
     Fetch Portfolio
  ============================== */
  const fetchPortfolios = async () => {
    try {
      const res = await axios.get(API_URL);
      const portfolios = res.data;

      // Aggregate by symbol
      const combined = {};

      portfolios.forEach((p) => {
        const symbol = p.stock?.symbol || p.stock?.id || "N/A";

        if (!combined[symbol]) {
          combined[symbol] = {
            id: p.id,
            symbol,
            totalQuantity: p.quantity,
            totalPrice: p.avgPrice * p.quantity,
            type: p.transactionType,
          };
        } else {
          combined[symbol].totalQuantity += p.quantity;
          combined[symbol].totalPrice += p.avgPrice * p.quantity;
        }
      });

      const portfolioData = Object.values(combined).map((item, index) => ({
        sirno: index + 1,
        id: item.id,
        symbol: item.symbol,
        quantity: item.totalQuantity,
        avgPrice: item.totalPrice / item.totalQuantity,
        type: item.type,
      }));

      setPortfolio(portfolioData);

      // Load stored prices
      const storedPrices =
        JSON.parse(localStorage.getItem("currentPrices")) || {};
      setCurrentPrices(storedPrices);

      // Fetch fresh prices
      const symbols = portfolioData.map((h) => h.symbol);

      if (symbols.length === 0) return;

      const priceRes = await axios.post(PRICE_API, { symbols });
      const freshPrices = priceRes.data;

      const updatedPrices = {};
      for (let sym of symbols) {
        const basePrice = freshPrices[sym] || 0;
        const adjusted = basePrice * (0.99 + Math.random() * 0.02);
        updatedPrices[sym] = parseFloat(adjusted.toFixed(2));
      }

      setCurrentPrices(updatedPrices);
      localStorage.setItem("currentPrices", JSON.stringify(updatedPrices));
    } catch (err) {
      console.error("Portfolio Fetch Error:", err);
    }
  };

  /* ==============================
     Fetch History
  ============================== */
  const fetchHistory = async () => {
    try {
      const res = await axios.get(HISTORY_API);

      const historyData = res.data
        .map((item, index) => ({
          sirno: index + 1,
          id: item.id,
          symbol: item.stock?.symbol || item.stock?.id || "N/A",
          quantity: item.quantity,
          avgPrice: item.avgPrice,
          type: item.transactionType,
          profitLoss: item.profitLoss ?? 0,
          timestamp: new Date(item.timestamp).toLocaleDateString(),
        }))
        .reverse(); // Reverse to show latest first

      setHistory(historyData);
    } catch (err) {
      console.error("History Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    fetchHistory();
  }, []);

  /* ==============================
     Buy / Sell Handler
  ============================== */
const handleBuySell = async (id, profitLoss, transactionType) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/buy-sell`,
      {
        profitLoss,
        transactionType 
      }
    );

    alert(`✅ ${response.data}`);

    fetchPortfolios();
    fetchHistory();

  } catch (err) {
    const errorMsg = err.response?.data || err.message;
    alert(`❌ Error: ${errorMsg}`);
  }
};

  /* ==============================
     Totals Calculation
  ============================== */
  const totals = portfolio.reduce(
    (acc, h) => {
      const currentPrice = currentPrices[h.symbol] || 0;
      const invested = h.quantity * h.avgPrice;

      let profit = 0;
      if (h.type === "BUY") {
        profit = (currentPrice - h.avgPrice) * h.quantity;
      } else {
        profit = (h.avgPrice - currentPrice) * h.quantity;
      }

      acc.invested += invested;
      acc.currentValue += h.quantity * currentPrice;
      acc.profit += profit;

      return acc;
    },
    { invested: 0, currentValue: 0, profit: 0 }
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        💰 Portfolio & History
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "portfolio"
              ? "border-b-4 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          📊 Portfolio ({portfolio.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "history"
              ? "border-b-4 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          📜 Transaction History ({history.length})
        </button>
      </div>

      {/* ================= Portfolio ================= */}
      {activeTab === "portfolio" && (
        <table className="w-full border-collapse border shadow mb-6">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Avg</th>
              <th className="border p-2">Current</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Invested</th>
              <th className="border p-2">Profit/Loss</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {portfolio.map((h) => {
              const currentPrice = currentPrices[h.symbol] || 0;
              const invested = h.quantity * h.avgPrice;

              let profit =
                h.type === "BUY"
                  ? (currentPrice - h.avgPrice) * h.quantity
                  : (h.avgPrice - currentPrice) * h.quantity;

              // const toggleLabel = h.type === "BUY" ? "buy" : "sell";

              return (
                <tr key={h.sirno} className="text-center">
                  <td className="border p-2">{h.symbol}</td>
                  <td className="border p-2">{h.quantity}</td>
                  <td className="border p-2">
                    {h.avgPrice.toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {currentPrice.toFixed(2)}
                  </td>
                  <td className="border p-2">{h.type}</td>
                  <td className="border p-2">
                    {invested.toFixed(2)}
                  </td>
                  <td
                    className={`border p-2 ${
                      profit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {profit.toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <button
onClick={() =>
  handleBuySell(h.id, profit, h.type.toUpperCase())
}                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      {h.type === "BUY" ? "sell" : "buy"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-bold text-center">
              <td colSpan="5" className="border p-2">
                TOTAL
              </td>
              <td className="border p-2">
                {totals.invested.toFixed(2)}
              </td>
              <td
                className={`border p-2 ${
                  totals.profit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {totals.profit.toFixed(2)}
              </td>
              <td className="border p-2">-</td>
            </tr>
          </tfoot>
        </table>
      )}

      {/* ================= History ================= */}
      {activeTab === "history" && (
        <table className="w-full border-collapse border shadow">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Profit/Loss</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {history.slice(0, displayedHistoryCount).map((h) => (
              <tr key={h.sirno} className="text-center">
                <td className="border p-2">{h.symbol}</td>
                <td className="border p-2">{h.quantity}</td>
                <td className="border p-2">
                  {h.avgPrice.toFixed(2)}
                </td>
                <td className="border p-2">{h.type}</td>
                <td
                  className={`border p-2 ${
                    h.profitLoss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(h.profitLoss ?? 0).toFixed(2)}
                </td>
                <td className="border p-2">
                  {h.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      
      )}
      {displayedHistoryCount < history.length && (
  <div className="flex justify-center mt-6">
    <button
      onClick={() => setDisplayedHistoryCount(prev => prev + 10)}
      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
    >
      Load More ({history.length - displayedHistoryCount} remaining)
    </button>
  </div>
)}
    </div>
  );
}