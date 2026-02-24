import React, { useEffect, useState } from "react";

const IPO = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const api_base = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${api_base}/api/stocks/ipo`;

  useEffect(() => {
    // 1️⃣ Load cached IPOs from localStorage
    const cachedIPOs = localStorage.getItem("ipoData");
    if (cachedIPOs) {
      setIpos(JSON.parse(cachedIPOs));
      setLoading(false); // show cached IPOs immediately
    }

    // 2️⃣ Fetch latest IPOs from backend
    const fetchIPOs = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        console.log("Fetched IPO data:", data);

        let allIPOs = [];
        if (data && typeof data === "object") {
          if (Array.isArray(data.active)) allIPOs = [...allIPOs, ...data.active];
          if (Array.isArray(data.listed)) allIPOs = [...allIPOs, ...data.listed];
        } else if (Array.isArray(data)) {
          allIPOs = data;
        }

        setIpos(allIPOs);
        localStorage.setItem("ipoData", JSON.stringify(allIPOs));
      } catch (err) {
        console.error("Error fetching IPOs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIPOs();
  }, [API_URL]);

  if (loading && ipos.length === 0)
    return <p className="text-center p-4">Loading IPOs...</p>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {ipos.length > 0 ? (
        ipos.map((ipo, idx) => (
          <div
            key={idx}
            className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">{ipo.name}</h2>
            <p className="text-sm text-gray-500">Symbol: {ipo.symbol}</p>
            <p className="text-sm">Status: {ipo.status}</p>

            {ipo.additional_text && (
              <p className="text-xs text-blue-600 mt-1">{ipo.additional_text}</p>
            )}

            <div className="mt-2 text-sm">
              {ipo.bidding_start_date && (
                <p>
                  <span className="font-medium">Bidding:</span>{" "}
                  {ipo.bidding_start_date} → {ipo.bidding_end_date}
                </p>
              )}
              {ipo.min_price && ipo.max_price && (
                <p>
                  <span className="font-medium">Price Range:</span>{" "}
                  {ipo.min_price} - {ipo.max_price}
                </p>
              )}
              {ipo.lot_size && (
                <p>
                  <span className="font-medium">Lot Size:</span> {ipo.lot_size}
                </p>
              )}
              {ipo.listing_date && (
                <p>
                  <span className="font-medium">Listing Date:</span>{" "}
                  {ipo.listing_date}
                </p>
              )}
              {ipo.listing_price && (
                <p>
                  <span className="font-medium">Listing Price:</span>{" "}
                  {ipo.listing_price}
                </p>
              )}
              {ipo.listing_gains && (
                <p>
                  <span className="font-medium">Listing Gains:</span>{" "}
                  {ipo.listing_gains}
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No IPOs available
        </p>
      )}
    </div>
  );
};

export default IPO;
