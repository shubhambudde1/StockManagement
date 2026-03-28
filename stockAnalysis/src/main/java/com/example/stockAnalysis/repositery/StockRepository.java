package com.example.stockAnalysis.repositery;



import com.example.stockAnalysis.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByWatchlistId(Long watchlistId);

    // Autocomplete search
    @Query(value = """
        SELECT symbol, company_name
        FROM company_listing
        WHERE symbol ILIKE :search || '%'
        OR company_name ILIKE :search || '%'
        LIMIT 10
        """, nativeQuery = true)
    List<Object[]> searchStocks(@Param("search") String search);

}
