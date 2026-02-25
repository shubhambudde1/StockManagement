import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/portfolios";
const PRICE_API = "http://localhost:4000/api/current-prices";
const HISTORY_API = "http://localhost:8080/api/transaction-history";

export default function CurrentPriceTable() {
  const [portfolio, setPortfolio] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [activeTab, setActiveTab] = useState("portfolio");

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
            avgPrice: p.avgPrice,
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

      // Pull from localStorage first
      const storedPrices = JSON.parse(localStorage.getItem("currentPrices")) || {};
      setCurrentPrices(storedPrices);

      // Fetch fresh current prices from API
      const symbols = portfolioData.map((h) => h.symbol);
      const priceRes = await axios.post(PRICE_API, { symbols });
      const freshPrices = priceRes.data;

      // Optionally simulate live updates
      const updatedPrices = {};
      for (let sym of symbols) {
        const oldPrice = storedPrices[sym] || freshPrices[sym];
        const newPrice = freshPrices[sym];
        const adjustedPrice = oldPrice * (0.99 + Math.random() * 0.02);
        updatedPrices[sym] = parseFloat(adjustedPrice.toFixed(2));
      }

      setCurrentPrices(updatedPrices);
      localStorage.setItem("currentPrices", JSON.stringify(updatedPrices));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(HISTORY_API);
      const historyData = res.data.map((item, index) => ({
        sirno: index + 1,
        id: item.id,
        symbol: item.stock?.symbol || item.stock?.id || "N/A",
        quantity: item.quantity,
        avgPrice: item.avgPrice,
        type: item.transactionType,
        timestamp: new Date(item.timestamp).toLocaleDateString(),
      }));
      setHistory(historyData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    fetchHistory();
  }, []);

  // Handle buy/sell action
const handleBuySell = async (id, action) => {
  console.log(`Clicked ${action}:`, id);
  console.log("Sending request to:", `${API_URL}/${id}/buy-sell`);

  try {
    const response = await axios.post(`${API_URL}/${id}/buy-sell`);
    
    console.log("Response from server:", response.data);
    alert(`✅ ${response.data}`);

    // Refresh portfolio and history
    fetchPortfolios();
    fetchHistory();

  } catch (err) {
    const errorMsg = err.response?.data || err.message;
    console.error(`Error on ${action}:`, errorMsg);
    alert(`❌ Error: ${errorMsg}`);
  }
};

  // Totals
  const totals = portfolio.reduce(
    (acc, h) => {
      const currentPrice = currentPrices[h.symbol] || 0;
      const invested = h.quantity * h.avgPrice;

      let profit = 0;
      if (h.type === "BUY") {
        profit = (currentPrice - h.avgPrice) * h.quantity;
      } else if (h.type === "SELL") {
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
      <h1 className="text-2xl font-bold mb-4">💰 Portfolio & History</h1>

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

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div>
          <table className="w-full border-collapse border shadow mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sir No</th>
                <th className="border p-2">Symbol</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Avg Price</th>
                <th className="border p-2">Current Price</th>
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

                let profit = 0;
                if (h.type === "BUY") {
                  profit = (currentPrice - h.avgPrice) * h.quantity;
                } else if (h.type === "SELL") {
                  profit = (h.avgPrice - currentPrice) * h.quantity;
                }

                const toggleLabel = h.type === "BUY" ? "Sell" : "Buy";
                const toggleColor =
                  h.type === "BUY"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-orange-500 hover:bg-orange-600";

                return (
                  <tr key={h.sirno} className="text-center">
                    <td className="border p-2">{h.sirno}</td>
                    <td className="border p-2">{h.symbol}</td>
                    <td className="border p-2">{h.quantity}</td>
                    <td className="border p-2">{h.avgPrice.toFixed(2)}</td>
                    <td className="border p-2">{currentPrice.toFixed(2)}</td>
                    <td className="border p-2">{h.type}</td>
                    <td className="border p-2">{invested.toFixed(2)}</td>
                    <td
                      className={`border p-2 ${
                        profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {profit.toFixed(2)}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleBuySell(h.id, toggleLabel)}
                        className={`px-3 py-1 text-white rounded font-semibold ${toggleColor}`}
                      >
                        {toggleLabel === "Sell" ? "📤 Sell" : "📥 Buy"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {portfolio.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-gray-500 p-4 text-center">
                    No portfolio data found
                  </td>
                </tr>
              )}
            </tbody>
            {portfolio.length > 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-bold text-center">
                  <td colSpan="6" className="border p-2">
                    TOTAL
                  </td>
                  <td className="border p-2">{totals.invested.toFixed(2)}</td>
                  <td
                    className={`border p-2 ${
                      totals.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {totals.profit.toFixed(2)}
                  </td>
                  <td className="border p-2">-</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div>
          <table className="w-full border-collapse border shadow mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sir No</th>
                <th className="border p-2">Symbol</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.sirno} className="text-center">
                  <td className="border p-2">{h.sirno}</td>
                  <td className="border p-2">{h.symbol}</td>
                  <td className="border p-2">{h.quantity}</td>
                  <td className="border p-2">{h.avgPrice.toFixed(2)}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded font-semibold ${
                        h.type === "BUY"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {h.type}
                    </span>
                  </td>
                  <td className="border p-2">{h.timestamp}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-gray-500 p-4 text-center">
                    No transaction history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
