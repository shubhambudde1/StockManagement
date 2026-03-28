import yfinance as yf
from datetime import datetime, timedelta

SECTOR_INDEXES = {
    "NIFTY IT": "^CNXIT",
    "NIFTY Pharma": "^CNXPHARMA",
    "NIFTY Realty": "^CNXREALTY",
    "NIFTY Auto": "^CNXAUTO",
    "NIFTY Bank": "^NSEBANK",
    "NIFTY Financial Services": "^CNXFINANCE",
    "NIFTY FMCG": "^CNXFMCG",
    "NIFTY Metal": "^CNXMETAL",
    "NIFTY Energy": "^CNXENERGY",
    "NIFTY Media": "^CNXMEDIA",
    "NIFTY PSU Bank": "^CNXPSUBANK"
}

def get_sector_changes():
    results = {}
    today = datetime.today()

    for name, ticker in SECTOR_INDEXES.items():
        try:
            data = yf.Ticker(ticker).history(period="5y")

            if data.empty:
                results[name] = {"error": "No data"}
                continue

            latest = data["Close"].iloc[-1]
            prev_day = data["Close"].iloc[-2]

            week_ago = data["Close"].iloc[-6] if len(data) >= 6 else latest
            month_ago = data["Close"].iloc[-22] if len(data) >= 22 else latest
            six_months_ago = data["Close"].iloc[-130] if len(data) >= 130 else latest
            one_year_ago = data["Close"].iloc[-252] if len(data) >= 252 else latest
            five_years_ago = data["Close"].iloc[-1260] if len(data) >= 1260 else latest

            results[name] = {
                "latest": round(float(latest), 2),
                "daily_change_%": round(((latest - prev_day) / prev_day) * 100, 2),
                "1w_change_%": round(((latest - week_ago) / week_ago) * 100, 2),
                "1m_change_%": round(((latest - month_ago) / month_ago) * 100, 2),
                "6m_change_%": round(((latest - six_months_ago) / six_months_ago) * 100, 2),
                "1y_change_%": round(((latest - one_year_ago) / one_year_ago) * 100, 2),
                "5y_change_%": round(((latest - five_years_ago) / five_years_ago) * 100, 2),
            }

        except Exception as e:
            results[name] = {"error": str(e)}

    return results


if __name__ == "__main__":
    data = get_sector_changes()
    for sector, values in data.items():
        print(sector, values)