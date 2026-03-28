package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.service.GrowthServicedata;
import com.example.stockAnalysis.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
public class StockControllerGrowth {

    @Autowired
    private GrowthServicedata stockService;

    @GetMapping("/growth")
    public List<Map<String, Object>> getGrowth(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam double percent,
            @RequestParam String type
    ) {
        return stockService.getGrowthData(
                LocalDate.parse(startDate),
                LocalDate.parse(endDate),
                percent,
                type
        );
    }
}