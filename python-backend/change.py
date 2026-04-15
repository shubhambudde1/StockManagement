import yfinance as yf


def normalize_symbol(symbol: str, default_suffix: str = ".NS") -> str:
    symbol = symbol.strip().upper()
    if "." not in symbol:
        symbol = f"{symbol}{default_suffix}"
    return symbol


def get_percentage_change(symbol: str) -> dict:
    stock = yf.Ticker(symbol)

    periods = {
        "1d": "1d",
        "1w": "5d",
        "1m": "1mo",
        "3m": "3mo",
        "6m": "6mo",
        "1y": "1y",
        "5y": "5y"
    }

    results = {}

    for key, period in periods.items():
        try:
            hist = stock.history(period=period)

            if len(hist) > 1:
                start_price = hist["Close"].iloc[0]
                end_price = hist["Close"].iloc[-1]
                percent_change = ((end_price - start_price) / start_price) * 100
                results[key] = round(percent_change, 2)
            else:
                results[key] = None

        except Exception:
            results[key] = None

    return results


def get_multiple_changes(stocks: list) -> dict:
    result = {}

    for stock in stocks:
        symbol = normalize_symbol(stock)
        result[symbol] = get_percentage_change(symbol)

    return result      


#                 from flask import Flask, jsonify, request
# from stock_service import get_percentage_change, get_multiple_changes, normalize_symbol

# app = Flask(__name__)


# @app.route("/stock/<symbol>")
# def stock(symbol):
#     symbol = normalize_symbol(symbol)
#     data = get_percentage_change(symbol)

#     return jsonify({
#         "symbol": symbol,
#         "changes": data
#     })


# @app.route("/stocks", methods=["POST"])
# def stocks():
#     body = request.get_json()
#     stock_list = body.get("stocks", [])

#     data = get_multiple_changes(stock_list)

#     return jsonify(data)


# if __name__ == "__main__":
#     app.run(debug=True)