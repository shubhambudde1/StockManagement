// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StockDashboard from "./components/StockDashboard";
import Header from "./header";
import AuthPage from "./components/auth/AuthPage";
import StockCard from "./components/search/StockCard";
import Watchlist from "./components/watchlist/Wachlist";
import Account from "./components/account/Account";
import Actions from "./components/Actions/Actions";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Default Dashboard */}
        <Route path="/" element={<StockDashboard />} />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Stock Details */}
        <Route path="/stock/:symbol" element={<StockCard />} />

        {/* Watchlist */}
        <Route path="/watchlist" element={<Watchlist />} />

       {/* Actions */}
        <Route path="/Actions" element={<Actions />} />


        {/* Account */}
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}