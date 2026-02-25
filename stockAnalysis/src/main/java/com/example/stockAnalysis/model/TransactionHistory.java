package com.example.stockAnalysis.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_history")
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Stock stock;

    @Column(nullable = false)
    private BigDecimal quantity;   // ✅ changed

    @Column(nullable = false)
    private BigDecimal avgPrice;   // ✅ changed

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType; // BUY or SELL

    private LocalDateTime timestamp = LocalDateTime.now();

    // ===================== GETTERS =====================

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Stock getStock() { return stock; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getAvgPrice() { return avgPrice; }
    public TransactionType getTransactionType() { return transactionType; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // ===================== SETTERS =====================

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setStock(Stock stock) { this.stock = stock; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public void setAvgPrice(BigDecimal avgPrice) { this.avgPrice = avgPrice; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}