# STOCK_SEARCH.py

import yfinance as yf

def get_stock_info(symbol):
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        hist = stock.history(period="1d")

        if not info:
            return {"error": "Stock not found"}

        current_price = None
        if not hist.empty:
            current_price = round(float(hist["Close"].iloc[-1]), 2)

        data = {
            "name": info.get("longName"),
            "symbol": info.get("symbol"),
            "exchange": info.get("exchange"),

            "current_price_inr": current_price,
            "day_high_inr": info.get("dayHigh"),
            "day_low_inr": info.get("dayLow"),

            "52_week_high_inr": info.get("fiftyTwoWeekHigh"),
            "52_week_low_inr": info.get("fiftyTwoWeekLow"),

            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": round(info.get("dividendYield", 0) * 100, 2) if info.get("dividendYield") else None,

            "volume": info.get("volume"),
            "market_cap_inr": info.get("marketCap"),

            "industry": info.get("industry"),
            "sector": info.get("sector"),
        }

        return data

    except Exception as e:
        return {"error": str(e)}