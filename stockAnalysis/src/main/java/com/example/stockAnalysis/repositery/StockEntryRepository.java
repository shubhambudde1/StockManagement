package com.example.stockAnalysis.repositery;

import com.example.stockAnalysis.model.StockEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {
}