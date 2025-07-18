package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"data-server/internal/ports/input"
	"data-server/pkg/response"
)

// EventHandler handles event-related HTTP requests
type EventHandler struct {
	eventService input.EventService
}

// NewEventHandler creates a new event handler
func NewEventHandler(eventService input.EventService) *EventHandler {
	return &EventHandler{
		eventService: eventService,
	}
}

// GetAllEvents handles GET /api/v1/events
func (h *EventHandler) GetAllEvents(c *gin.Context) {
	ctx := c.Request.Context()
	
	events, err := h.eventService.GetAllEvents(ctx)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve events", err)
		return
	}
	
	response.Success(c, events)
}

// GetEventsByType handles GET /api/v1/events/:eventType
func (h *EventHandler) GetEventsByType(c *gin.Context) {
	ctx := c.Request.Context()
	eventType := c.Param("eventType")
	
	events, err := h.eventService.GetEventsByType(ctx, eventType)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetEventsByBlockRange handles GET /api/v1/events/blocks/:start/:end
func (h *EventHandler) GetEventsByBlockRange(c *gin.Context) {
	ctx := c.Request.Context()
	
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
	
	events, err := h.eventService.GetEventsByBlockRange(ctx, startBlock, endBlock)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetEventsByCategory handles GET /api/v1/events/category/:category
func (h *EventHandler) GetEventsByCategory(c *gin.Context) {
	ctx := c.Request.Context()
	category := c.Param("category")
	
	events, err := h.eventService.GetEventsByCategory(ctx, category)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetEventsByValidator handles GET /api/v1/events/validator/:stash
func (h *EventHandler) GetEventsByValidator(c *gin.Context) {
	ctx := c.Request.Context()
	stash := c.Param("stash")
	
	events, err := h.eventService.GetEventsByValidator(ctx, stash)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Events not found", err)
		return
	}
	
	response.Success(c, events)
}

// GetEventStats handles GET /api/v1/events/stats
func (h *EventHandler) GetEventStats(c *gin.Context) {
	ctx := c.Request.Context()
	
	stats, err := h.eventService.GetEventStats(ctx)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve event stats", err)
		return
	}
	
	response.Success(c, stats)
} 