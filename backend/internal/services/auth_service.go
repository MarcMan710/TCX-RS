package services

import (
	"context"
	"errors"
	"time"

	"KARO-BRS/backend/config"
	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/repositories"
	"KARO-BRS/backend/utils"
)

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
)

// AuthService defines the interface for authentication logic.
type AuthService interface {
	Register(ctx context.Context, req *models.UserRegisterRequest) (*models.UserResponse, error)
	Login(ctx context.Context, req *models.UserLoginRequest) (string, *models.UserResponse, error)
	GetUserByID(ctx context.Context, id int64) (*models.UserResponse, error)
}

type authService struct {
	userRepo repositories.UserRepository
	cfg      *config.Config
}

// NewAuthService returns a new instance of AuthService.
func NewAuthService(userRepo repositories.UserRepository, cfg *config.Config) AuthService {
	return &authService{
		userRepo: userRepo,
		cfg:      cfg,
	}
}

// Register registers a new customer account.
func (s *authService) Register(ctx context.Context, req *models.UserRegisterRequest) (*models.UserResponse, error) {
	// Check if email already exists
	existingUser, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		return nil, ErrEmailAlreadyExists
	}

	// Hash the raw password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Role:     models.RoleCustomer, // Default role for standard registration
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	resp := user.ToResponse()
	return &resp, nil
}

// Login verifies credentials and generates a signed JWT.
func (s *authService) Login(ctx context.Context, req *models.UserLoginRequest) (string, *models.UserResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return "", nil, ErrInvalidCredentials
	}

	// Compare hashed password with input password
	if !utils.CheckPasswordHash(req.Password, user.Password) {
		return "", nil, ErrInvalidCredentials
	}

	// Generate JWT authentication token
	token, err := utils.GenerateJWT(user.ID, string(user.Role), s.cfg.JWTSecret, time.Duration(s.cfg.JWTExpirationHours)*time.Hour)
	if err != nil {
		return "", nil, err
	}

	resp := user.ToResponse()
	return token, &resp, nil
}

// GetUserByID fetches user details by ID for authenticated sessions.
func (s *authService) GetUserByID(ctx context.Context, id int64) (*models.UserResponse, error) {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrUserNotFound
	}

	resp := user.ToResponse()
	return &resp, nil
}
