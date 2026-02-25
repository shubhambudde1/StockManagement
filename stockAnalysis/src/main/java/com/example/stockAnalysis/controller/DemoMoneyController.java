package com.example.stockAnalysis.controller;


import com.example.stockAnalysis.model.DemoMoney;

import com.example.stockAnalysis.service.DemoMoneyService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo-money")
@CrossOrigin(origins = "*")
public class DemoMoneyController {

    private final DemoMoneyService demoMoneyService;

    public DemoMoneyController(DemoMoneyService demoMoneyService) {
        this.demoMoneyService = demoMoneyService;
    }

    @PostMapping("/{userId}/init")
    public DemoMoney initDemoMoney(@PathVariable Long userId) {
        return demoMoneyService.createDemoMoneyForUser(userId);
    }

    @PostMapping("/{userId}/spend")
    public DemoMoney spend(@PathVariable Long userId, @RequestParam Double amount) {
        return demoMoneyService.spend(userId, amount);
    }

    @PostMapping("/{userId}/profit")
    public DemoMoney addProfit(@PathVariable Long userId, @RequestParam Double amount) {
        return demoMoneyService.addProfit(userId, amount);
    }

    @GetMapping("/{userId}")
    public DemoMoney getDemoMoney(@PathVariable Long userId) {
        return demoMoneyService.getDemoMoney(userId);
    }
}
