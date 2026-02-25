package com.example.stockAnalysis.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/stocks")
public class simpleApi {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String API_KEY = " 6893463775bb90.26980023";

    @GetMapping("/{symbol}/realtime")
    public ResponseEntity<?> getLivePrice(@PathVariable String symbol) {
        String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="
                + symbol + "&apikey=" + API_KEY;
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{symbol}/history")
    public ResponseEntity<?> getHistory(@PathVariable String symbol) {
        String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
                + symbol + "&apikey=" + API_KEY;
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/news")
    public ResponseEntity<?> getNews() {
        String url = "https://stock.indianapi.in/news";
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("X-Api-Key", "sk-live-wGNfNFi5wAq1hvryZqYP1RhXL1cZ9FXvNsMxg3vu");
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

        String response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class).getBody();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ipo")
    public ResponseEntity<?> getIpo() {
        String url = "https://stock.indianapi.in/ipo";
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("X-Api-Key", "sk-live-wGNfNFi5wAq1hvryZqYP1RhXL1cZ9FXvNsMxg3vu");
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

        String response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class).getBody();
        return ResponseEntity.ok(response);
    }

}
