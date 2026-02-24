// src/utils/currency.js

// ✅ API-based conversion (live rate)
export async function convertUsdToInr(usdAmount) {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    const usdToInr = data.rates.INR;
    return (usdAmount * usdToInr).toFixed(2);
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

// ✅ Fixed conversion (if you don’t want API call every time)
// export function convertUsdToInr(usdAmount) {
//   const usdToInrRate = 83.0; // set manually
//   return (usdAmount * usdToInrRate).toFixed(2);
// }

// import { convertUsdToInr } from "../utils/currency";

// const inrPrice = await convertUsdToInr(50);
// console.log("50 USD = ", inrPrice, "INR");
