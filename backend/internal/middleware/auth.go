package middleware

import (
	"context"
	"net/http"
	"strings"

	"KARO-BRS/backend/utils"
)

type AuthMiddleware struct {
	jwtSecret string
}

func NewAuthMiddleware(jwtSecret string) *AuthMiddleware {
	return &AuthMiddleware{jwtSecret: jwtSecret}
}

// Authenticate validates the Bearer JWT token from the Authorization header
// and injects the user's ID and Role into the request context.
func (m *AuthMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.WriteJSONError(w, http.StatusUnauthorized, "Authorization header required")
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			utils.WriteJSONError(w, http.StatusUnauthorized, "Invalid authorization header format (expected 'Bearer <token>')")
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateJWT(tokenString, m.jwtSecret)
		if err != nil {
			utils.WriteJSONError(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		// Inject user information into request context
		ctx := context.WithValue(r.Context(), "userID", claims.UserID)
		ctx = context.WithValue(ctx, "userRole", claims.Role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
