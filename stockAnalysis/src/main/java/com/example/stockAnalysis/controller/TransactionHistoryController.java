package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.model.Portfolio;
import com.example.stockAnalysis.model.TransactionHistory;
import com.example.stockAnalysis.repositery.PortfolioRepository;
import com.example.stockAnalysis.repositery.TransactionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction-history")
@CrossOrigin(origins = "*")
public class TransactionHistoryController {

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;

    // Get all transactions
    @GetMapping
    public List<TransactionHistory> getAllTransactions() {
        return transactionHistoryRepository.findAll();
    }

    // Get transactions by user
    @GetMapping("/user/{userId}")
    public List<TransactionHistory> getTransactionsByUser(@PathVariable Long userId) {
        return transactionHistoryRepository.findByUserId(userId);
    }

}

