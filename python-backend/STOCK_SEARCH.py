


import yfinance as yf



def get_stock_info(symbol):
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        
        data = {
            "symbol": info.get("symbol"),
            "name": info.get("shortName"),
            "current_price_inr": info.get("currentPrice"),
            "day_high_inr": info.get("dayHigh"),
            "day_low_inr": info.get("dayLow"),
            "market_cap_inr": info.get("marketCap"),
            "volume": info.get("volume"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": info.get("dividendYield"),
            "52_week_high_inr": info.get("fiftyTwoWeekHigh"),
            "52_week_low_inr": info.get("fiftyTwoWeekLow"),
            "industry": info.get("industry"),
            "sector": info.get("sector"),
            "exchange": info.get("exchange"),
        }
        return data
    except Exception as e:
        return {"error": str(e)}

