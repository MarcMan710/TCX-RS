package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"KARO-BRS/backend/config"
	"KARO-BRS/backend/internal/handlers"
	"KARO-BRS/backend/internal/middleware"
	"KARO-BRS/backend/internal/repositories"
	"KARO-BRS/backend/internal/services"
	"KARO-BRS/backend/routes"
)

func main() {
	// 1. Load application configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// 2. Connect to PostgreSQL database
	db, err := initDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// 3. Initialize repositories (Data Layer)
	userRepo := repositories.NewUserRepository(db)
	courtRepo := repositories.NewCourtRepository(db)
	timeSlotRepo := repositories.NewTimeSlotRepository(db)
	reservationRepo := repositories.NewReservationRepository(db)

	// 4. Initialize services (Business Logic Layer)
	authService := services.NewAuthService(userRepo, cfg)
	courtService := services.NewCourtService(courtRepo)
	timeSlotService := services.NewTimeSlotService(timeSlotRepo)
	reservationService := services.NewReservationService(reservationRepo, courtRepo, timeSlotRepo)

	// 5. Initialize handlers (Presentation Layer)
	authHandler := handlers.NewAuthHandler(authService)
	courtHandler := handlers.NewCourtHandler(courtService)
	timeSlotHandler := handlers.NewTimeSlotHandler(timeSlotService)
	reservationHandler := handlers.NewReservationHandler(reservationService)

	// 6. Configure middleware
	authMiddleware := middleware.NewAuthMiddleware(cfg.JWTSecret)
	roleMiddleware := middleware.NewRoleMiddleware()

	// 7. Register API routes
	router := routes.SetupRoutes(routes.RouterDeps{
		AuthHandler:        authHandler,
		CourtHandler:       courtHandler,
		TimeSlotHandler:    timeSlotHandler,
		ReservationHandler: reservationHandler,
		AuthMiddleware:     authMiddleware,
		RoleMiddleware:     roleMiddleware,
	})

	// 8. Configure & Start HTTP server with graceful shutdown
	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a non-blocking goroutine
	go func() {
		log.Printf("Server is running on port %s...", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful shutdown listener
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited cleanly.")
}

func initDB(cfg *config.Config) (*sql.DB, error) {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Successfully connected to the database")
	return db, nil
}
