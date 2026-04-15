import yfinance as yf
import pg8000
import time

conn = pg8000.connect(
    host="localhost",
    database="stockdb",
    user="shubham",
    password="admin",
    port=5432
)

cursor = conn.cursor()

cursor.execute("SELECT symbol FROM company_listing")
stocks = cursor.fetchall()

def get_sector(symbol):
    try:
        ticker = yf.Ticker(symbol.strip() + ".NS")
        info = ticker.info
        sector = info.get("sector", None)
        print(f"FETCHED: {symbol} → {sector}")
        return sector
    except Exception as e:
        print(f"❌ Error for {symbol}: {e}")
        return None

updates = []

for (symbol,) in stocks:   # 🔥 limit for testing
    sector = get_sector(symbol)

    if sector:
        updates.append((sector, symbol))
    else:
        print(f"⚠️ No sector for {symbol}")

    time.sleep(0.5)

print(f"\nTotal updates to apply: {len(updates)}")

# ✅ Correct table name here
cursor.executemany(
    "UPDATE company_listing SET sector = %s WHERE symbol = %s",
    updates
)

print("Rows affected:", cursor.rowcount)

conn.commit()

cursor.close()
conn.close()

print("🎉 Done")