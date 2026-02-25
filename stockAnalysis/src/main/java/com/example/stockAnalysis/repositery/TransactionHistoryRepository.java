package com.example.stockAnalysis.repositery;

import com.example.stockAnalysis.model.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionHistoryRepository
        extends JpaRepository<TransactionHistory, Long> {

    List<TransactionHistory> findByUserId(Long userId);
}