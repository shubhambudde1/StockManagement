package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.service.GrowthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/growth")
public class GrowthController {

    @Autowired
    private GrowthService growthService;

    @GetMapping
    public List<Map<String, Object>> getGrowthData(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam Double minGrowth,
            @RequestParam String mode
    ) {
        return growthService.getGrowth(startDate, endDate, minGrowth, mode);
    }
}
