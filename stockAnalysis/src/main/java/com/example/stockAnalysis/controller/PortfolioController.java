package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.model.Portfolio;
import com.example.stockAnalysis.model.TransactionHistory;
import com.example.stockAnalysis.model.TransactionType;
import com.example.stockAnalysis.repositery.PortfolioRepository;
import com.example.stockAnalysis.repositery.TransactionHistoryRepository;
import com.example.stockAnalysis.service.PortfolioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;


    // Get all portfolios
    @GetMapping
    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    // Get portfolios by user ID
    @GetMapping("/user/{userId}")
    public List<Portfolio> getPortfoliosByUser(@PathVariable Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    // Get portfolio by ID
    @GetMapping("/{id}")
    public Optional<Portfolio> getPortfolioById(@PathVariable Long id) {
        return portfolioRepository.findById(id);
    }

    // Create new portfolio entry (BUY)
    @PostMapping
    public Portfolio createPortfolio(@RequestBody Portfolio portfolio) {
        return portfolioService.addPortfolio(
                portfolio.getUser().getId(),
                portfolio.getStock().getId(),
                portfolio.getQuantity(),
                portfolio.getAvgPrice(),
                portfolio.getTransactionType()
        );
    }

    // Update portfolio
    @PutMapping("/{id}")
    public Portfolio updatePortfolio(@PathVariable Long id,
                                     @RequestBody Portfolio updatedPortfolio) {

        return portfolioRepository.findById(id).map(portfolio -> {
            portfolio.setUser(updatedPortfolio.getUser());
            portfolio.setStock(updatedPortfolio.getStock());
            portfolio.setQuantity(updatedPortfolio.getQuantity());
            portfolio.setAvgPrice(updatedPortfolio.getAvgPrice());
            portfolio.setTransactionType(updatedPortfolio.getTransactionType());
            return portfolioRepository.save(portfolio);
        }).orElseThrow(() -> new RuntimeException("Portfolio not found"));
    }

    // Delete portfolio
    @DeleteMapping("/{id}")
    public void deletePortfolio(@PathVariable Long id) {
        portfolioRepository.deleteById(id);
    }

    // SELL STOCK (Move to Transaction History and remove from portfolio)
    @PostMapping("/{id}/buy-sell")
    public String sellStock(@PathVariable Long id) {

        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        // Create Transaction History entry
        TransactionHistory history = new TransactionHistory();
        history.setUser(portfolio.getUser());
        history.setStock(portfolio.getStock());
        history.setQuantity(portfolio.getQuantity());
        history.setAvgPrice(portfolio.getAvgPrice());
        history.setTransactionType(TransactionType.SELL);
        history.setTimestamp(LocalDateTime.now());

        transactionHistoryRepository.save(history);

        // Remove from portfolio
        portfolioRepository.deleteById(id);

        return "Stock Sold Successfully!";
    }
}