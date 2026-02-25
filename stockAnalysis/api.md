post http://localhost:8080/api/sets

{
"setId": 1,
"totalInvested": 50000,
"totalProfitLoss": 1200,
"entries": [
{
"id": 1,
"symbol": "RELIANCE",
"quantity": 13,
"avgPrice": 163.69,
"currentPrice": 170,
"type": "BUY",
"invested": 2128,
"profitLoss": 200
}
]
}

Growth classs
store procedure

CALL get_growth_dynamic('2024-10-01', '2024-11-01', 50, 'both');
CALL get_growth_dynamic('2024-10-01', '2024-11-01', 50, 'positive');
CALL get_growth_dynamic('2024-10-01', '2024-11-01', 50, 'negative');

api
http://localhost:8080/api/growth?startDate=2024-01-01&endDate=2024-11-28&minGrowth=50&mode=positive




