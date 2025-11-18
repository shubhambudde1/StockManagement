# # another.py
# import yfinance as yf
# import pandas as pd
# from datetime import datetime

# # --- Conversion function ---
# def convert_to_inr(value, rate=83):
#     """Convert USD value to INR using a fixed rate"""
#     if value is None:
#         return 0
#     return round(value * rate, 2)

# # --- Helper to safely convert DataFrame or Series to dict ---
# def df_or_series_to_dict(obj):
#     """
#     Safely convert pandas DataFrame or Series to dict.
#     Series will be converted to DataFrame first.
#     Returns empty dict if None.
#     """
#     if obj is None:
#         return {}
#     if isinstance(obj, pd.Series):
#         obj = obj.to_frame()
#     return obj.to_dict(orient='split')

# # --- Main function to get stock info ---
# def get_stock_info(symbol):
#     if not symbol.upper().endswith('.NS'):
#         symbol = symbol.upper() + '.NS'
#     ticker = yf.Ticker(symbol)

#     info = ticker.info

#     # Earnings date conversion
#     earnings_date = info.get("earningsDate")
#     if earnings_date:
#         if isinstance(earnings_date, (int, float)):
#             earnings_date = datetime.fromtimestamp(earnings_date).isoformat()
#         elif isinstance(earnings_date, (list, tuple)) and earnings_date:
#             earnings_date = earnings_date[0].isoformat() if isinstance(earnings_date[0], datetime) else str(earnings_date[0])

#     # Company info
#     company_info = {
#         "Name": info.get("longName"),
#         "Sector": info.get("sector"),
#         "Industry": info.get("industry"),
#         "market_cap_inr": convert_to_inr(info.get("marketCap")),
#         "current_price_inr": convert_to_inr(info.get("regularMarketPrice")),
#         "previous_close_inr": convert_to_inr(info.get("previousClose")),
#         "open_inr": convert_to_inr(info.get("open")),
#         "day_high_inr": convert_to_inr(info.get("dayHigh")),
#         "day_low_inr": convert_to_inr(info.get("dayLow")),
#         "52_week_high_inr": convert_to_inr(info.get("fiftyTwoWeekHigh")),
#         "52_week_low_inr": convert_to_inr(info.get("fiftyTwoWeekLow")),
#         "volume": info.get("volume"),
#         "average_volume": info.get("averageVolume"),
#         "dividend_yield": info.get("dividendYield"),
#         "pe_ratio": info.get("trailingPE"),
#         "eps": info.get("trailingEps"),
#         "earnings_date": earnings_date,
#         "recommendation": info.get("recommendationKey"),
#         "Website": info.get("website"),
#         "Country": info.get("country")
#     }

#     # Historical data
#     hist = ticker.history(period="1y")

#     # Financials
#     balance_sheet = ticker.balance_sheet
#     cashflow = ticker.cashflow
#     financials = ticker.financials

#     # Major holders
#     major_holders = ticker.major_holders
#     institutional_holders = ticker.institutional_holders

#     # Dividends and stock splits
#     dividends = ticker.dividends
#     splits = ticker.splits

#     # Combine all data
#     data = {
#         "Company Info": company_info,
#         "Historical Data": df_or_series_to_dict(hist),
#         "Dividends": df_or_series_to_dict(dividends),
#         "Stock Splits": df_or_series_to_dict(splits),
#         "Major Holders": df_or_series_to_dict(major_holders),
#         "Institutional Holders": df_or_series_to_dict(institutional_holders),
#         "Balance Sheet": df_or_series_to_dict(balance_sheet),
#         "Cashflow": df_or_series_to_dict(cashflow),
#         "Income Statement": df_or_series_to_dict(financials)
#     }

#     return data



# app.py
from flask import Flask, request, jsonify
import yfinance as yf

app = Flask(__name__)

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

@app.route("/stock", methods=["GET"])
def stock():
    symbol = request.args.get("symbol")
    if not symbol:
        return jsonify({"error": "Please provide a stock symbol"}), 400

    # Add .NS for NSE stocks if not present
    if not symbol.upper().endswith('.NS'):
        symbol = symbol.upper() + '.NS'
    else:
        symbol = symbol.upper()
    
    data = get_stock_info(symbol)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
