package utils

import (
	"encoding/json"
	"net/http"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
}

type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

func WriteJSON(w http.ResponseWriter, statusCode int, payload interface{}, data ...interface{}) {
	if len(data) > 0 {
		message, ok := payload.(string)
		if !ok {
			message = ""
		}

		payload = APIResponse{
			Success: true,
			Message: message,
			Data:    data[0],
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

func WriteJSONSuccess(w http.ResponseWriter, statusCode int, data interface{}) {
	WriteJSON(w, statusCode, APIResponse{
		Success: true,
		Data:    data,
	})
}

func WriteJSONError(w http.ResponseWriter, statusCode int, message string) {
	WriteJSON(w, statusCode, APIResponse{
		Success: false,
		Error: &APIError{
			Code:    statusCode,
			Message: message,
		},
	})
}

func WriteJSONErrorWithDetails(w http.ResponseWriter, statusCode int, message string, details string) {
	WriteJSON(w, statusCode, APIResponse{
		Success: false,
		Error: &APIError{
			Code:    statusCode,
			Message: message,
			Details: details,
		},
	})
}

// Specific HTTP Status Response Helpers

func BadRequest(w http.ResponseWriter, message string) {
	WriteJSONError(w, http.StatusBadRequest, message)
}

func Unauthorized(w http.ResponseWriter, message string) {
	WriteJSONError(w, http.StatusUnauthorized, message)
}

func Forbidden(w http.ResponseWriter, message string) {
	WriteJSONError(w, http.StatusForbidden, message)
}

func NotFound(w http.ResponseWriter, message string) {
	WriteJSONError(w, http.StatusNotFound, message)
}

func Conflict(w http.ResponseWriter, message string) {
	WriteJSONError(w, http.StatusConflict, message)
}

func InternalServerError(w http.ResponseWriter, message string) {
	WriteJSONError(w, http.StatusInternalServerError, message)
}
