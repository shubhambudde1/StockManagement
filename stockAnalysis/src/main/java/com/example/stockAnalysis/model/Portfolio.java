package com.example.stockAnalysis.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private BigDecimal avgPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private LocalDateTime date;

    // ✅ NEW FIELDS
    @Column(name = "stop_loss")
    private BigDecimal stopLoss;

    @Column(name = "target_price")
    private BigDecimal targetPrice;

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setStock(Stock stock) { this.stock = stock; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public void setAvgPrice(BigDecimal avgPrice) { this.avgPrice = avgPrice; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public void setDate(LocalDateTime date) { this.date = date; }

    // ✅ NEW SETTERS
    public void setStopLoss(BigDecimal stopLoss) { this.stopLoss = stopLoss; }
    public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }
}