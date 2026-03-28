package com.example.stockAnalysis.service;

import com.example.stockAnalysis.repositery.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    public List<Object[]> searchStocks(String query) {
        return stockRepository.searchStocks(query);
    }
}