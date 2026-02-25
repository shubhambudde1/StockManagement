package com.example.stockAnalysis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class sqlController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @GetMapping("/prices11")
    public List<Map<String, Object>> getPrices() {
        return jdbcTemplate.queryForList("SELECT * FROM historical_prices50");
    }
}
