package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.model.Stock;
import com.example.stockAnalysis.repositery.StockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class Search {


    private StockRepository stockRepo;

    public Search(StockRepository stockRepo) {
        this.stockRepo = stockRepo;
    }
    // ✅ Get stock symbol by stockId
    @GetMapping
    public ResponseEntity<?> searchStocks(@RequestParam String q) {
        return ResponseEntity.ok(stockRepo.searchStocks(q));
    }
}
