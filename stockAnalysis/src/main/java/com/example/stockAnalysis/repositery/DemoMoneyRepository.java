package com.example.stockAnalysis.repositery;

import com.example.stockAnalysis.model.DemoMoney;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DemoMoneyRepository extends JpaRepository<DemoMoney, Long> {
    Optional<DemoMoney> findByUserId(Long userId);
}
