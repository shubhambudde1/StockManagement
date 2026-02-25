package com.example.stockAnalysis.repositery;



import com.example.stockAnalysis.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {}