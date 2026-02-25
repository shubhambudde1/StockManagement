package com.example.stockAnalysis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "stock_entries")
public class StockEntry {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;
    private int quantity;
    private double avgPrice;
    private double currentPrice;
    private String type;
    private double invested;
    private double profitLoss;

    @ManyToOne
    @JoinColumn(name = "set_id")
    @JsonBackReference
    private StockSet stockSet;

    // getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(double avgPrice) {
        this.avgPrice = avgPrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getInvested() {
        return invested;
    }

    public void setInvested(double invested) {
        this.invested = invested;
    }

    public double getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(double profitLoss) {
        this.profitLoss = profitLoss;
    }

    public StockSet getStockSet() {
        return stockSet;
    }

    public void setStockSet(StockSet stockSet) {
        this.stockSet = stockSet;
    }
}
