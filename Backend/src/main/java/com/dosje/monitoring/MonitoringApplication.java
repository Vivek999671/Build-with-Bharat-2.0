package com.dosje.monitoring;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class MonitoringApplication {

    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(MonitoringApplication.class, args);
    }

    private static void loadDotenv() {
        // 1. Try loading .env from the current working directory
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .ignoreIfMalformed()
                    .load();

            dotenv.entries().forEach(entry -> {
                if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } catch (Exception ignored) {
        }

        // 2. If running from parent directory (e.g. workspace root), check Backend/.env
        if (System.getProperty("SUPABASE_DB_URL") == null && System.getenv("SUPABASE_DB_URL") == null) {
            try {
                File backendDir = new File("Backend");
                if (backendDir.exists() && backendDir.isDirectory()) {
                    Dotenv dotenv = Dotenv.configure()
                            .directory("Backend")
                            .ignoreIfMissing()
                            .ignoreIfMalformed()
                            .load();

                    dotenv.entries().forEach(entry -> {
                        if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                            System.setProperty(entry.getKey(), entry.getValue());
                        }
                    });
                }
            } catch (Exception ignored) {
            }
        }
    }
}

