package com.example.stockAnalysis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Stock {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;
    private String name;
    private Double currentPriceInr;
    private Long volume;
    private Long marketCapInr;
    private Double peRatio;
    private String industry;

    @ManyToOne
    @JoinColumn(name = "watchlist_id")
    @JsonBackReference   // ✅ Prevent infinite recursion
    private Watchlist watchlist;

    public void setId(Long id) { this.id = id; }

    public void setSymbol(String symbol) { this.symbol = symbol; }

    public void setName(String name) { this.name = name; }

    public void setCurrentPriceInr(Double currentPriceInr) { this.currentPriceInr = currentPriceInr; }

    public void setVolume(Long volume) { this.volume = volume; }

    public void setMarketCapInr(Long marketCapInr) { this.marketCapInr = marketCapInr; }

    public void setPeRatio(Double peRatio) { this.peRatio = peRatio; }

    public void setIndustry(String industry) { this.industry = industry; }

    public void setWatchlist(Watchlist watchlist) { this.watchlist = watchlist; }
}
