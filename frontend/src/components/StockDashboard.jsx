import React, { useState } from "react";
import General from "./general/General";
import News from "./news/News";
import IPO from "./ipo/IPO";
import StockCard from "./search/StockCard";
import { KeepAlive } from "react-activation";
import NseTopStocks from "./utils/NseTopStocks";

export default function StockDashboard() {
  const TABS = ["General", "News", "IPO", "Sport", "Tech", "Markets", "search"];
  const TICKER_ITEMS = [
    "SENSEX +0.35%",
    "NIFTY +0.40%",
    "DOW -0.10%",
    "NASDAQ +0.20%",
    "HONG KONG +0.15%",
  ];

  const [activeTab, setActiveTab] = useState("General");

  // Instead of re-rendering, mount all tabs but show/hide
  const renderContent = () => (
    <div>
      {/* General */}
      {activeTab === "General" && <General />}

      {/* News - KeepAlive preserves fetched articles */}
      {activeTab === "News" && (
        <KeepAlive name="News" when={true}>
          <News />
        </KeepAlive>
      )}

      {/* IPO */}
      {activeTab === "IPO" && (
        <KeepAlive name="IPO">
          <IPO />
        </KeepAlive>
      )}

      {/* Search */}
      {activeTab === "search" && (
        <KeepAlive name="StockCard">
          <StockCard />
        </KeepAlive>
      )}

      {activeTab === "Tech" && <div>Tech Page Content</div>}
      {activeTab === "Markets" && <div>Markets Page Content</div>}
    </div>
  );

  return (
    <div className="w-full bg-slate-50 p-4">
      <div className="w-full mx-auto">
        {/* Ad Banner */}
        <div className="w-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-lg p-6 text-white text-center mb-4 shadow-md">
          <h2 className="text-2xl font-semibold">Ad Poster / Sponsorship</h2>
          <p className="text-sm opacity-90">
            Your advertisement or featured banner goes here
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 whitespace-nowrap rounded-md shadow-sm ${
                  activeTab === tab
                    ? "bg-indigo-500 text-white"
                    : "bg-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-sm text-slate-500">Login • Subscribe</div>
        </div>

        {/* Ticker */}
        <div className="w-full overflow-hidden border rounded-md bg-white/80 shadow-sm mb-6">
          <style>{`
            @keyframes marquee { from { transform: translateX(100%);} to { transform: translateX(-100%);} }
            .marqueeInner { display: inline-block; white-space: nowrap; animation: marquee 18s linear infinite; }
          `}</style>
          <div className="px-3 py-2">
            <div className="marqueeInner">
              {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
                <span key={idx} className="inline-block mr-8 font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
              <NseTopStocks />
        {/* Main Content */}
        <div className="p-4 bg-white rounded-md shadow-sm">{renderContent()}</div>
      </div>
    </div>
  );
}
