package middleware

import (
	"net/http"

	"KARO-BRS/backend/internal/models"
	"KARO-BRS/backend/utils"
)

type RoleMiddleware struct{}

func NewRoleMiddleware() *RoleMiddleware {
	return &RoleMiddleware{}
}

// RequireRole enforces that the authenticated user has one of the allowed roles.
func (m *RoleMiddleware) RequireRole(allowedRoles ...models.UserRole) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			roleVal := r.Context().Value("userRole")
			if roleVal == nil {
				utils.WriteJSONError(w, http.StatusUnauthorized, "Authentication context missing")
				return
			}

			userRole, ok := roleVal.(string)
			if !ok {
				utils.WriteJSONError(w, http.StatusInternalServerError, "Invalid user context role format")
				return
			}

			for _, allowed := range allowedRoles {
				if userRole == string(allowed) {
					next.ServeHTTP(w, r)
					return
				}
			}

			utils.WriteJSONError(w, http.StatusForbidden, "Access denied: insufficient privileges")
		})
	}
}

// RequireAdmin is a shortcut helper middleware to restrict routes strictly to system administrators.
func (m *RoleMiddleware) RequireAdmin(next http.Handler) http.Handler {
	return m.RequireRole(models.RoleAdmin)(next)
}
