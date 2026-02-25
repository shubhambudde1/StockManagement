package com.example.stockAnalysis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GrowthService {

    @Autowired
    private JdbcTemplate jdbc;

    public List<Map<String, Object>> getGrowth(
            String startDate,
            String endDate,
            Double minGrowth,
            String mode
    ) {
        String sql = "CALL get_growth_dynamic(?, ?, ?, ?)";

        return jdbc.queryForList(sql, startDate, endDate, minGrowth, mode);
    }
}
