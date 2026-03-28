package com.example.stockAnalysis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class GrowthServicedata {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getGrowthData(
            LocalDate startDate,
            LocalDate endDate,
            double percent,
            String type
    ) {
        String sql = """
    SELECT * 
    FROM get_growth_dynamic_fn(
        ?::date, 
        ?::date, 
        ?::numeric, 
        ?::text
    )
""";
        return jdbcTemplate.queryForList(
                sql,
                startDate,
                endDate,
                percent,
                type
        );
    }
}