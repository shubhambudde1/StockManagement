package com.example.stockAnalysis.model;



import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // BUY or SELL

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private BigDecimal price; // Price per share

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setStock(Stock stock) { this.stock = stock; }
    public void setType(TransactionType type) { this.type = type; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
