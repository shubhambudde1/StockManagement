package com.example.stockAnalysis.service;

import com.example.stockAnalysis.model.*;
import com.example.stockAnalysis.repositery.PortfolioRepository;
import com.example.stockAnalysis.repositery.StockRepository;
import com.example.stockAnalysis.repositery.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private UserRepository userRepository;

    public Portfolio addPortfolio(Long userId, Long stockId, BigDecimal quantity, BigDecimal avgPrice, TransactionType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        return portfolioRepository.findByUserIdAndStockId(userId, stockId)
                .map(existingPortfolio -> {
                    // Stock exists, update portfolio
                    BigDecimal existingQuantity = existingPortfolio.getQuantity();
                    BigDecimal existingAvgPrice = existingPortfolio.getAvgPrice();

                    // Calculate new average price
                    BigDecimal totalValue = existingAvgPrice.multiply(existingQuantity)
                            .add(avgPrice.multiply(quantity));
                    BigDecimal newQuantity = existingQuantity.add(quantity);
                    BigDecimal newAvgPrice = totalValue.divide(newQuantity, 2, BigDecimal.ROUND_HALF_UP);

                    existingPortfolio.setQuantity(newQuantity);
                    existingPortfolio.setAvgPrice(newAvgPrice);
                    existingPortfolio.setDate(LocalDateTime.now());
                    return portfolioRepository.save(existingPortfolio);
                })
                .orElseGet(() -> {
                    // New stock, create new portfolio entry
                    Portfolio newPortfolio = new Portfolio();
                    newPortfolio.setUser(user);
                    newPortfolio.setStock(stock);
                    newPortfolio.setQuantity(quantity);
                    newPortfolio.setAvgPrice(avgPrice);
                    newPortfolio.setTransactionType(type);
                    newPortfolio.setDate(LocalDateTime.now());
                    return portfolioRepository.save(newPortfolio);
                });
    }

  
}
