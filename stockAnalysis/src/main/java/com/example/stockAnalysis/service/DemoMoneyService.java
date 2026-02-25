package com.example.stockAnalysis.service;

import com.example.stockAnalysis.model.DemoMoney;
import com.example.stockAnalysis.model.User;
import com.example.stockAnalysis.repositery.DemoMoneyRepository;
import com.example.stockAnalysis.repositery.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DemoMoneyService {

    private final DemoMoneyRepository demoMoneyRepository;
    private final UserRepository userRepository;

    public DemoMoneyService(DemoMoneyRepository demoMoneyRepository, UserRepository userRepository) {
        this.demoMoneyRepository = demoMoneyRepository;
        this.userRepository = userRepository;
    }

    // Initialize demo money for a new user
    public DemoMoney createDemoMoneyForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        DemoMoney demoMoney = DemoMoney.builder()
                .user(user)
                .totalAmount(1_000_000.0)
                .usedAmount(0.0)
                .remainingAmount(1_000_000.0)
                .build();
        return demoMoneyRepository.save(demoMoney);
    }

    // Spend amount (buy stocks)
    public DemoMoney spend(Long userId, Double amount) {
        DemoMoney demo = demoMoneyRepository.findByUserId(userId).orElseThrow();
        demo.updateUsed(amount);
        return demoMoneyRepository.save(demo);
    }

    // Refund or add profit
    public DemoMoney addProfit(Long userId, Double amount) {
        DemoMoney demo = demoMoneyRepository.findByUserId(userId).orElseThrow();
        demo.setUsedAmount(demo.getUsedAmount() - amount);  // refund reduces used
        demo.setRemainingAmount(demo.getTotalAmount() - demo.getUsedAmount());
        return demoMoneyRepository.save(demo);
    }

    // Get demo money info
    public DemoMoney getDemoMoney(Long userId) {
        return demoMoneyRepository.findByUserId(userId).orElseThrow();
    }
}
