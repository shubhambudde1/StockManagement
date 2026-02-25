package com.example.stockAnalysis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.stockAnalysis.repositery")
public class StockAnalysisApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockAnalysisApplication.class, args);
	}

}
