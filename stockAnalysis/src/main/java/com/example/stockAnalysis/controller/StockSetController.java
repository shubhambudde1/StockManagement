package com.example.stockAnalysis.controller;



import com.example.stockAnalysis.model.StockSet;
import com.example.stockAnalysis.service.StockSetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sets")
@CrossOrigin("*")
public class StockSetController {

    private final StockSetService stockSetService;

    public StockSetController(StockSetService stockSetService) {
        this.stockSetService = stockSetService;
    }

    // ➤ Save one full set (with entries)
    @PostMapping
    public StockSet saveSet(@RequestBody StockSet stockSet) {
        return stockSetService.saveStockSet(stockSet);
    }

    // ➤ Get all sets
    @GetMapping
    public List<StockSet> getAllSets() {
        return stockSetService.getAllSets();
    }

    // ➤ Get single set
    @GetMapping("/{id}")
    public StockSet getSet(@PathVariable Long id) {
        return stockSetService.getSet(id);
    }
}

