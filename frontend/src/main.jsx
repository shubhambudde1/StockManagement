import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AliveScope } from "react-activation";
import { StockProvider } from "./components/context/StockContext.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StockProvider>

  

    <App />
  
    </StockProvider>
  </React.StrictMode>,
)
