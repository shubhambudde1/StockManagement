// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockDashboard from "./components/StockDashboard";
import Header from "./header";
import AuthPage from "./components/auth/AuthPage";
import StockCard from "./components/search/StockCard";
import { KeepAlive } from "react-activation";
import Watchlist from "./components/watchlist/Wachlist";
import Account from "./components/account/Account"

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Default Dashboard */}
        <Route path="/" element={<StockDashboard />} />

        {/* KeepAlive should wrap the element, not Route */}
        <Route
          path="/auth"
          element={
            <KeepAlive>
              <AuthPage />
            </KeepAlive>
          }
        />
        <Route
          path="/stock/:symbol"
          element={
            <KeepAlive>
              <StockCard />
            </KeepAlive>
          }
        />
        <Route
          path="/Watchlist"
          element={
            <KeepAlive>
              <Watchlist />
            </KeepAlive>
          }
        />
        
        <Route
          path="/account"
          element={
            <KeepAlive>
              <Account />
            </KeepAlive>
          }
        />
      </Routes>
    </Router>
  );
}
