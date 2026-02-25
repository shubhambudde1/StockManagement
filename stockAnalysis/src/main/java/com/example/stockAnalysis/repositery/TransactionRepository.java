package com.example.stockAnalysis.repositery;



import com.example.stockAnalysis.model.Transaction;
import com.example.stockAnalysis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
}
