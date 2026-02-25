package com.example.stockAnalysis.repositery;

import com.example.stockAnalysis.model.StockSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockSetRepository extends JpaRepository<StockSet, Long> {
}
