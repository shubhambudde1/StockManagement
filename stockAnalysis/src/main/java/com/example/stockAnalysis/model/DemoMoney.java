package com.example.stockAnalysis.model;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "demo_money")
public class DemoMoney {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Link to User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    private Double totalAmount = 1_000_000.0;  // Initial demo money
    private Double usedAmount = 0.0;
    private Double remainingAmount = 1_000_000.0;

    // Update remaining automatically
    public void updateUsed(Double amount) {
        this.usedAmount += amount;
        this.remainingAmount = this.totalAmount - this.usedAmount;
    }
}
