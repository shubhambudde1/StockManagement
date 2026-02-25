package com.example.stockAnalysis.repositery;



import com.example.stockAnalysis.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByWatchlistId(Long watchlistId);
}
