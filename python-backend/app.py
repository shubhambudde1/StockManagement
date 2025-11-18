from flask import Flask, jsonify , request
import yfinance as yf
from datetime import datetime, timedelta
from flask_cors import CORS
from STOCK_SEARCH import get_stock_info

app = Flask(__name__)
CORS(app)  # <-- This enables CORS for all routes


# Define indices with their Yahoo Finance tickers
INDEXES = {
    "SENSEX": "^BSESN",     # BSE Sensex
    "NIFTY": "^NSEI",       # Nifty 50
    "DOW": "^DJI",          # Dow Jones
    "NASDAQ": "^IXIC",      # Nasdaq Composite
    "HONG KONG": "^HSI"     # Hang Seng
}

def get_index_changes():
    results = {}
    today = datetime.today()

    for name, ticker in INDEXES.items():
        try:
            data = yf.Ticker(ticker).history(period="6mo")  # fetch last 6 months
            if data.empty:
                results[name] = {"error": "No data"}
                continue

            latest = data["Close"].iloc[-1]
            prev_day = data["Close"].iloc[-2] if len(data) > 1 else latest

            # 1 week ago
            week_ago_date = today - timedelta(weeks=1)
            week_data = data.loc[:week_ago_date.strftime("%Y-%m-%d")]
            week_ago = week_data["Close"].iloc[-1] if not week_data.empty else latest

            # 1 month ago
            month_ago_date = today - timedelta(days=30)
            month_data = data.loc[:month_ago_date.strftime("%Y-%m-%d")]
            month_ago = month_data["Close"].iloc[-1] if not month_data.empty else latest

            # 3 months ago
            three_months_ago_date = today - timedelta(days=90)
            three_months_data = data.loc[:three_months_ago_date.strftime("%Y-%m-%d")]
            three_months_ago = three_months_data["Close"].iloc[-1] if not three_months_data.empty else latest

            # Percentage changes
            changes = {
                "latest": round(float(latest), 2),
                "daily_change_%": round(((latest - prev_day) / prev_day) * 100, 2),
                "1w_change_%": round(((latest - week_ago) / week_ago) * 100, 2),
                "1m_change_%": round(((latest - month_ago) / month_ago) * 100, 2),
                "3m_change_%": round(((latest - three_months_ago) / three_months_ago) * 100, 2),
            }
            results[name] = changes

        except Exception as e:
            results[name] = {"error": str(e)}

    return results


@app.route("/indexes", methods=["GET"])
def indexes():
    data = get_index_changes()
    return jsonify(data)

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

@app.route("/api/current-prices", methods=["POST"])
def get_current_prices():
    data = request.json
    symbols = data.get("symbols")
    if not symbols or not isinstance(symbols, list):
        return jsonify({"error": "Symbols must be a list"}), 400

    result = {}
    for symbol in symbols:
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="1d")
            if hist.empty:
                result[symbol] = None
            else:
                result[symbol] = round(hist['Close'].iloc[-1], 2)
        except Exception as e:
            result[symbol] = None

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=4000)
