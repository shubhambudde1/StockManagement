package com.example.stockAnalysis.controller;

import com.example.stockAnalysis.model.Watchlist;
import com.example.stockAnalysis.repositery.WatchlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlists")
@CrossOrigin(origins = "*") // allow React frontend
public class WatchlistController {

    private final WatchlistRepository watchlistRepo;

    public WatchlistController(WatchlistRepository watchlistRepo) {
        this.watchlistRepo = watchlistRepo;
    }

    // ✅ Get all watchlists
    @GetMapping
    public List<Watchlist> getAllWatchlists() {
        return watchlistRepo.findAll();
    }

    // ✅ Get one watchlist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Watchlist> getWatchlistById(@PathVariable Long id) {
        Watchlist watchlist = watchlistRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Watchlist not found"));
        return ResponseEntity.ok(watchlist);
    }

    // ✅ Create new watchlist
    @PostMapping
    public Watchlist createWatchlist(@RequestBody Watchlist watchlist) {
        return watchlistRepo.save(watchlist);
    }

    // ✅ Delete a watchlist
    @DeleteMapping("/{id}")
    public void deleteWatchlist(@PathVariable Long id) {
        watchlistRepo.deleteById(id);
    }
}
