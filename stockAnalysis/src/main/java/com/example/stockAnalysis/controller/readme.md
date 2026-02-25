WatchlistController

GET /api/watchlists → list all watchlists

GET /api/watchlists/{id} → get one watchlist

POST /api/watchlists → create new watchlist

DELETE /api/watchlists/{id} → delete a watchlist

StockController

GET /api/watchlists/{id}/stocks → get all stocks in a watchlist

POST /api/watchlists/{id}/stocks → add a stock

DELETE /api/watchlists/{id}/stocks/{stockId} → remove stock




portfolio
post/get http://localhost:8080/api/portfolios
{
"user": {
"id": 2
},
"stock": {
"id": 6
},
"quantity": 10,
"avgPrice": 150.00,
"transactionType": "BUY"
}



demo
Perfect! Let’s go step by step to **test your DemoMoney API using Postman**. I’ll assume your backend is running on `http://localhost:8080`.

---

## **1️⃣ Initialize Demo Money for a User**

**Endpoint:**

```
POST http://localhost:8080/api/demo-money/{userId}/init
```

**Path Parameter:**

* `userId` → the ID of the user you created (from signup).

**Example:**

```
POST http://localhost:8080/api/demo-money/1/init
```

**Body:**

* None required.

**Response:**

```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "shubham"
    },
    "totalAmount": 1000000.0,
    "usedAmount": 0.0,
    "remainingAmount": 1000000.0
}
```

✅ This confirms the demo account is initialized.

---

## **2️⃣ Spend Demo Money (Buy Stock)**

**Endpoint:**

```
POST http://localhost:8080/api/demo-money/{userId}/spend?amount={amount}
```

**Example:**

```
POST http://localhost:8080/api/demo-money/1/spend?amount=20000
```

**Response:**

```json
{
    "id": 1,
    "user": { "id": 1, "username": "shubham" },
    "totalAmount": 1000000.0,
    "usedAmount": 20000.0,
    "remainingAmount": 980000.0
}
```

✅ This deducts the spent amount from the remaining demo balance.

---

## **3️⃣ Add Profit / Refund Money**

**Endpoint:**

```
POST http://localhost:8080/api/demo-money/{userId}/profit?amount={amount}
```

**Example:**

```
POST http://localhost:8080/api/demo-money/1/profit?amount=5000
```

**Response:**

```json
{
    "id": 1,
    "user": { "id": 1, "username": "shubham" },
    "totalAmount": 1000000.0,
    "usedAmount": 15000.0,
    "remainingAmount": 985000.0
}
```

✅ This adds profit back to the remaining balance by reducing the `usedAmount`.

---

## **4️⃣ Get Demo Money Status**

**Endpoint:**

```
GET http://localhost:8080/api/demo-money/{userId}
```

**Example:**

```
GET http://localhost:8080/api/demo-money/1
```

**Response:**

```json
{
    "id": 1,
    "user": { "id": 1, "username": "shubham" },
    "totalAmount": 1000000.0,
    "usedAmount": 15000.0,
    "remainingAmount": 985000.0
}
```

---

### **Postman Tips**

1. Use **Path Variables** in Postman for `{userId}`.
2. Use **Query Params** for `amount` in `/spend` and `/profit` endpoints.
3. Check your **Spring Boot console** for errors if responses fail.
4. Test in order: **init → spend → profit → get**, so your data flows correctly.

---

If you want, I can make a **full Postman collection JSON** with all four endpoints pre-configured, so you can import it directly and test with one click.

Do you want me to create that?
