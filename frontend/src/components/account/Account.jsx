import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/portfolios";
const PRICE_API = "http://localhost:4000/api/current-prices";

export default function CurrentPriceTable() {
  const [history, setHistory] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});

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

      const historyData = Object.values(combined).map((item, index) => ({
        sirno: index + 1,
        symbol: item.symbol,
        quantity: item.totalQuantity,
        avgPrice: item.totalPrice / item.totalQuantity,
        type: item.type,
      }));

      setHistory(historyData);

      // Pull from localStorage first
      const storedPrices = JSON.parse(localStorage.getItem("currentPrices")) || {};
      setCurrentPrices(storedPrices);

      // Fetch fresh current prices from API
      const symbols = historyData.map((h) => h.symbol);
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

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Delete row locally (and optionally call API if needed)
  const handleDelete = (symbol) => {
    const updatedHistory = history.filter((h) => h.symbol !== symbol);
    setHistory(updatedHistory);

    const updatedPrices = { ...currentPrices };
    delete updatedPrices[symbol];
    setCurrentPrices(updatedPrices);
    localStorage.setItem("currentPrices", JSON.stringify(updatedPrices));
  };

  // Totals
  const totals = history.reduce(
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
      <h1 className="text-2xl font-bold mb-4">💰 Current Price Table</h1>

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
          {history.map((h) => {
            const currentPrice = currentPrices[h.symbol] || 0;
            const invested = h.quantity * h.avgPrice;

            let profit = 0;
            if (h.type === "BUY") {
              profit = (currentPrice - h.avgPrice) * h.quantity;
            } else if (h.type === "SELL") {
              profit = (h.avgPrice - currentPrice) * h.quantity;
            }

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
                    onClick={() => handleDelete(h.symbol)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {history.length === 0 && (
            <tr>
              <td colSpan="9" className="text-gray-500 p-4 text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
        {history.length > 0 && (
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
  );
}
