package com.example.stockAnalysis.service;



import com.example.stockAnalysis.model.StockEntry;
import com.example.stockAnalysis.model.StockSet;
import com.example.stockAnalysis.repositery.StockSetRepository;
import org.springframework.stereotype.Service;

@Service
public class StockSetService {

    private final StockSetRepository stockSetRepository;

    public StockSetService(StockSetRepository stockSetRepository) {
        this.stockSetRepository = stockSetRepository;
    }

    public StockSet saveStockSet(StockSet stockSet) {
        // Set parent reference for each entry
        for (StockEntry entry : stockSet.getEntries()) {
            entry.setStockSet(stockSet);
        }
        return stockSetRepository.save(stockSet);
    }

    public StockSet getSet(Long id) {
        return stockSetRepository.findById(id).orElse(null);
    }

    public java.util.List<StockSet> getAllSets() {
        return stockSetRepository.findAll();
    }
}
