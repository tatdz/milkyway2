package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIResponse represents the standard API response structure
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

// Success sends a successful response
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Data:    data,
	})
}

// Error sends an error response
func Error(c *gin.Context, statusCode int, message string, err error) {
	errorMsg := message
	if err != nil {
		errorMsg = err.Error()
	}
	
	c.JSON(statusCode, APIResponse{
		Success: false,
		Error:   errorMsg,
		Message: message,
	})
}

// BadRequest sends a bad request response
func BadRequest(c *gin.Context, message string) {
	Error(c, http.StatusBadRequest, message, nil)
}

// NotFound sends a not found response
func NotFound(c *gin.Context, message string) {
	Error(c, http.StatusNotFound, message, nil)
}

// InternalServerError sends an internal server error response
func InternalServerError(c *gin.Context, message string, err error) {
	Error(c, http.StatusInternalServerError, message, err)
}

// Unauthorized sends an unauthorized response
func Unauthorized(c *gin.Context, message string) {
	Error(c, http.StatusUnauthorized, message, nil)
}

// Forbidden sends a forbidden response
func Forbidden(c *gin.Context, message string) {
	Error(c, http.StatusForbidden, message, nil)
} 