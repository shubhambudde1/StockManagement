package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.model.Stock;
import com.example.stockAnalysis.model.Watchlist;
import com.example.stockAnalysis.repositery.StockRepository;
import com.example.stockAnalysis.repositery.WatchlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlists/{watchlistId}/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockRepository stockRepo;
    private final WatchlistRepository watchlistRepo;

    public StockController(StockRepository stockRepo, WatchlistRepository watchlistRepo) {
        this.stockRepo = stockRepo;
        this.watchlistRepo = watchlistRepo;
    }

    // ✅ Get all stocks in a watchlist
    @GetMapping
    public List<Stock> getStocks(@PathVariable Long watchlistId) {
        return stockRepo.findByWatchlistId(watchlistId);
    }

    // ✅ Add a stock to watchlist
    @PostMapping
    public ResponseEntity<Stock> addStock(@PathVariable Long watchlistId, @RequestBody Stock stock) {
        Watchlist watchlist = watchlistRepo.findById(watchlistId)
                .orElseThrow(() -> new RuntimeException("Watchlist not found"));
        stock.setWatchlist(watchlist);
        Stock saved = stockRepo.save(stock);
        return ResponseEntity.ok(saved);
    }

    // ✅ Delete stock from watchlist
    @DeleteMapping("/{stockId}")
    public void removeStock(@PathVariable Long stockId) {
        stockRepo.deleteById(stockId);
    }

    // ✅ Get stock symbol by stockId
    @GetMapping("/{stockId}/symbol")
    public ResponseEntity<String> getStockSymbol(@PathVariable Long stockId) {
        Stock stock = stockRepo.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
        return ResponseEntity.ok(stock.getSymbol());
    }
}
