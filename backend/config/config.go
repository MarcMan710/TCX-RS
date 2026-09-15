package config

import (
"fmt"
"os"
"strconv"
)

// Config holds all application configuration settings.
type Config struct {
// Server settings
Port        string
Environment string

// Database settings
DBHost     string
DBPort     string
DBUser     string
DBPassword string
DBName     string
DBSSLMode  string

// JWT Authentication settings
JWTSecret         string
JWTExpirationHours int

}

// LoadConfig loads configuration from environment variables, falling back to defaults if not set.
func LoadConfig() (*Config, error) {
cfg := &Config{
Port:               getEnv("PORT", "8080"),
Environment:        getEnv("APP_ENV", "development"),
DBHost:             getEnv("DB_HOST", "localhost"),
DBPort:             getEnv("DB_PORT", "5432"),
DBUser:             getEnv("DB_USER", "postgres"),
DBPassword:         getEnv("DB_PASSWORD", "postgres"),
DBName:             getEnv("DB_NAME", "court_reservation_db"),
DBSSLMode:          getEnv("DB_SSLMODE", "disable"),
JWTSecret:          getEnv("JWT_SECRET", "super-secret-default-key-change-in-production"),
JWTExpirationHours: getEnvAsInt("JWT_EXPIRATION_HOURS", 24),
}

// Validate essential production rules
if cfg.Environment == "production" && cfg.JWTSecret == "super-secret-default-key-change-in-production" {
	return nil, fmt.Errorf("JWT_SECRET environment variable must be explicitly defined in production mode")
}

return cfg, nil

}

// Helper function to read an environment variable with a default fallback
func getEnv(key, defaultValue string) string {
if value, exists := os.LookupEnv(key); exists && value != "" {
return value
}
return defaultValue
}

// Helper function to read an environment variable as an integer with a default fallback
func getEnvAsInt(key string, defaultValue int) int {
valueStr := getEnv(key, "")
if value, err := strconv.Atoi(valueStr); err == nil {
return value
}
return defaultValue
}