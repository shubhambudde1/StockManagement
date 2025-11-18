import yfinance as yf
from datetime import datetime, timedelta

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
            data = yf.Ticker(ticker).history(period="6mo")  # get last 6 months
            if data.empty:
                results[name] = {"error": "No data"}
                continue

            # Latest close
            latest = data["Close"].iloc[-1]

            # Previous day close
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

            # Calculate percentage changes
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


if __name__ == "__main__":
    values = get_index_changes()
    for k, v in values.items():
        print(k, v)
