from flask import Flask, jsonify, request
from STOCK_SEARCH import get_stock_info

app = Flask(__name__)


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