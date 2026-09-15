package handlers

import (
	"encoding/json"
	"net/http"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/internal/services"
	"KARO-BRS/backend/utils"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Register handles user registration (POST /api/v1/auth/register).
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.UserRegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := req.Validate(); err != nil {
		utils.WriteJSONError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	user, err := h.authService.Register(r.Context(), &req)
	if err != nil {
		if err == services.ErrEmailAlreadyExists {
			utils.WriteJSONError(w, http.StatusConflict, "Email is already registered")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to register user")
		return
	}

	utils.WriteJSON(w, http.StatusCreated, "User registered successfully", user)
}

// Login handles user authentication and JWT generation (POST /api/v1/auth/login).
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.UserLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	token, user, err := h.authService.Login(r.Context(), &req)
	if err != nil {
		if err == services.ErrInvalidCredentials {
			utils.WriteJSONError(w, http.StatusUnauthorized, "Invalid email or password")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to authenticate user")
		return
	}

	response := map[string]interface{}{
		"token": token,
		"user":  user,
	}

	utils.WriteJSON(w, http.StatusOK, "Login successful", response)
}

// Me retrieves the profile of the currently authenticated user (GET /api/v1/auth/me).
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int64)
	if !ok || userID <= 0 {
		utils.WriteJSONError(w, http.StatusUnauthorized, "Unauthorized request")
		return
	}

	user, err := h.authService.GetUserByID(r.Context(), userID)
	if err != nil {
		if err == services.ErrUserNotFound {
			utils.WriteJSONError(w, http.StatusNotFound, "User not found")
			return
		}
		utils.WriteJSONError(w, http.StatusInternalServerError, "Failed to retrieve user profile")
		return
	}

	utils.WriteJSON(w, http.StatusOK, "User profile retrieved successfully", user)
}