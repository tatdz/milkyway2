package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"data-server/internal/ports/input"
	"data-server/pkg/response"
)

// ValidatorHandler handles validator-related HTTP requests
type ValidatorHandler struct {
	validatorService input.ValidatorService
}

// NewValidatorHandler creates a new validator handler
func NewValidatorHandler(validatorService input.ValidatorService) *ValidatorHandler {
	return &ValidatorHandler{
		validatorService: validatorService,
	}
}

// GetAllValidators handles GET /api/v1/validators
func (h *ValidatorHandler) GetAllValidators(c *gin.Context) {
	ctx := c.Request.Context()
	
	validators, err := h.validatorService.GetAllValidators(ctx)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve validators", err)
		return
	}
	
	response.Success(c, validators)
}

// GetValidatorByType handles GET /api/v1/validators/:type
func (h *ValidatorHandler) GetValidatorByType(c *gin.Context) {
	ctx := c.Request.Context()
	validatorType := c.Param("type")
	
	validator, err := h.validatorService.GetValidatorByType(ctx, validatorType)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Validator not found", err)
		return
	}
	
	response.Success(c, validator)
}

// GetValidatorEvents handles GET /api/v1/validators/:type/events
func (h *ValidatorHandler) GetValidatorEvents(c *gin.Context) {
	ctx := c.Request.Context()
	validatorType := c.Param("type")
	
	events, err := h.validatorService.GetValidatorEvents(ctx, validatorType)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Validator events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetValidatorEventsByType handles GET /api/v1/validators/:type/events/:eventType
func (h *ValidatorHandler) GetValidatorEventsByType(c *gin.Context) {
	ctx := c.Request.Context()
	validatorType := c.Param("type")
	eventType := c.Param("eventType")
	
	events, err := h.validatorService.GetValidatorEventsByType(ctx, validatorType, eventType)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetValidatorEventsByBlockRange handles GET /api/v1/validators/:type/events/blocks/:start/:end
func (h *ValidatorHandler) GetValidatorEventsByBlockRange(c *gin.Context) {
	ctx := c.Request.Context()
	validatorType := c.Param("type")
	
	startBlockStr := c.Param("start")
	endBlockStr := c.Param("end")
	
	startBlock, err := strconv.Atoi(startBlockStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid start block", err)
		return
	}
	
	endBlock, err := strconv.Atoi(endBlockStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid end block", err)
		return
	}
	
	events, err := h.validatorService.GetValidatorEventsByBlockRange(ctx, validatorType, startBlock, endBlock)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetValidatorStats handles GET /api/v1/validators/:type/stats
func (h *ValidatorHandler) GetValidatorStats(c *gin.Context) {
	ctx := c.Request.Context()
	validatorType := c.Param("type")
	
	stats, err := h.validatorService.GetValidatorStats(ctx, validatorType)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Validator stats not found", err)
		return
	}
	
	response.Success(c, stats)
} 