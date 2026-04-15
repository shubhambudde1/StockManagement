import yfinance as yf
import pandas as pd
import psycopg2
import time
from datetime import timedelta
from psycopg2.extras import execute_batch

# ===================== PostgreSQL Config =====================
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "stockdb",
    "user": "shubham",
    "password": "admin"
}

# ===================== Date Config =====================
DEFAULT_START_DATE = "2010-01-01"
END_DATE = "2020-01-02"  # inclusive till 2020-01-01
END_DATE_OBJ = pd.to_datetime("2020-01-01").date()


# ===================== DB Connection =====================
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# ===================== Create Table =====================
def create_historical_prices_table():
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS historical_prices (
            symbol VARCHAR(20),
            date DATE,
            open DOUBLE PRECISION,
            high DOUBLE PRECISION,
            low DOUBLE PRECISION,
            close DOUBLE PRECISION,
            volume BIGINT,
            PRIMARY KEY (symbol, date)
        )
    """)
    conn.commit()

# ===================== Get Symbols =====================
def get_all_symbols():
    cursor.execute("SELECT symbol FROM company_listing")
    symbols = [row[0] for row in cursor.fetchall()]

    # Ensure NSE suffix
    return [s if s.endswith(".NS") else f"{s}.NS" for s in symbols]

# ===================== Get Last Stored Date =====================
def get_last_date(symbol):
    cursor.execute(
        "SELECT MAX(date) FROM historical_prices WHERE symbol = %s",
        (symbol,)
    )
    return cursor.fetchone()[0]

# ===================== Fetch Stock Data =====================
def fetch_stock_data(symbol, start_date, end_date):
    try:
        df = yf.download(
            symbol,
            start=start_date,
            end=end_date,
            auto_adjust=False,
            progress=False,
            threads=False
        )

        if df.empty:
            return None

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        df.reset_index(inplace=True)
        df["symbol"] = symbol

        return df[["symbol", "Date", "Open", "High", "Low", "Close", "Volume"]]

    except Exception as e:
        print(f"[ERROR] {symbol}: {e}")
        return None

# ===================== Save to DB (FAST) =====================
def save_to_db(df):
    insert_query = """
        INSERT INTO historical_prices
        (symbol, date, open, high, low, close, volume)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (symbol, date) DO NOTHING
    """

    records = [
        (
            row.symbol,
            pd.to_datetime(row.Date).date(),
            float(row.Open),
            float(row.High),
            float(row.Low),
            float(row.Close),
            int(row.Volume)
        )
        for row in df.itertuples(index=False)
    ]

    execute_batch(cursor, insert_query, records, page_size=500)
    conn.commit()

# ===================== Main Process =====================
def process_all_symbols():
    create_historical_prices_table()
    symbols = get_all_symbols()

    print(f"[INFO] Found {len(symbols)} symbols")

    for idx, symbol in enumerate(symbols, start=1):
        last_date = get_last_date(symbol)

        if last_date and last_date >= END_DATE_OBJ:
            print(f"[{idx}] {symbol} already up-to-date")
            continue

        if last_date:
            start_date = (last_date + timedelta(days=1)).strftime("%Y-%m-%d")
        else:
            start_date = DEFAULT_START_DATE

      #  print(f"[{idx}] Fetching {symbol} ({start_date} → {END_DATE})")

        df = fetch_stock_data(symbol, start_date, END_DATE)

        if df is not None:
            save_to_db(df)
            print(f"[✓] Saved {symbol}")

        # Prevent Yahoo rate limit
        time.sleep(0.4)

# ===================== Run =====================
if __name__ == "__main__":
    try:
        process_all_symbols()
    except KeyboardInterrupt:
        print("\n[STOPPED] Manually interrupted")
    finally:
        cursor.close()
        conn.close()
        print("[DONE] DB connection closed")
