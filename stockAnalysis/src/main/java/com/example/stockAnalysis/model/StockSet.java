package com.example.stockAnalysis.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "stock_sets")
public class StockSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long setId;

    private double totalInvested;
    private double totalProfitLoss;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "stockSet", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<StockEntry> entries;

    // getters & setters
    public Long getSetId() {
        return setId;
    }

    public void setSetId(Long setId) {
        this.setId = setId;
    }

    public double getTotalInvested() {
        return totalInvested;
    }

    public void setTotalInvested(double totalInvested) {
        this.totalInvested = totalInvested;
    }

    public double getTotalProfitLoss() {
        return totalProfitLoss;
    }

    public void setTotalProfitLoss(double totalProfitLoss) {
        this.totalProfitLoss = totalProfitLoss;
    }

    public List<StockEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<StockEntry> entries) {
        this.entries = entries;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
