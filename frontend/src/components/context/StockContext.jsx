import React, { createContext, useContext, useState } from "react";

// Create context
const StockContext = createContext();

// Provider
export const StockProvider = ({ children }) => {
  const [stock, setStock] = useState(null);

  return (
    <StockContext.Provider value={{ stock, setStock }}>
      {children}
    </StockContext.Provider>
  );
};

// Custom hook
export const useStock = () => useContext(StockContext);
