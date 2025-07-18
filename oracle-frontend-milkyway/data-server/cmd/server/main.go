package main

import (
	"log"
	"os"

	"data-server/internal/adapters/input/http/handlers"
	"data-server/internal/adapters/input/usecases"
	"data-server/internal/adapters/output/memory"
	"data-server/pkg/response"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Get port from environment variable (Fly.io sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize repositories (output adapters)
	validatorRepo := memory.NewValidatorRepository()

	// Initialize use cases (input ports)
	validatorService := usecases.NewValidatorUseCase(validatorRepo)
	eventService := usecases.NewEventUseCase(validatorRepo)

	// Initialize handlers (input adapters)
	validatorHandler := handlers.NewValidatorHandler(validatorService)
	eventHandler := handlers.NewEventHandler(eventService)

	// Initialize documentation handler
	docsHandler, err := handlers.NewDocsHandler()
	if err != nil {
		log.Fatal("Failed to initialize docs handler:", err)
	}

	// Setup router
	r := setupRouter(validatorHandler, eventHandler, docsHandler)

	log.Println("Starting Blockchain Data API server on :" + port)
	log.Println("Available endpoints:")
	log.Println("  GET /api/v1/validators - Get all validators")
	log.Println("  GET /api/v1/validators/:type - Get specific validator (good/neutral/bad)")
	log.Println("  GET /api/v1/validators/:type/events - Get events for specific validator")
	log.Println("  GET /api/v1/validators/:type/events/:eventType - Get events by type for validator")
	log.Println("  GET /api/v1/validators/:type/events/blocks/:start/:end - Get events by block range for validator")
	log.Println("  GET /api/v1/validators/:type/stats - Get validator statistics")
	log.Println("  GET /api/v1/events - Get all events")
	log.Println("  GET /api/v1/events/:eventType - Get events by event type")
	log.Println("  GET /api/v1/events/blocks/:start/:end - Get events by block range")
	log.Println("  GET /api/v1/events/category/:category - Get events by category")
	log.Println("  GET /api/v1/events/validator/:stash - Get events by validator")
	log.Println("  GET /api/v1/events/stats - Get event statistics")
	log.Println("  GET /api/v1/health - Health check")
	log.Println("  GET /docs - Interactive API documentation")
	log.Println("  GET /docs/openapi.yaml - Raw OpenAPI specification")

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func setupRouter(validatorHandler *handlers.ValidatorHandler, eventHandler *handlers.EventHandler, docsHandler *handlers.DocsHandler) *gin.Engine {
	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Documentation routes
	r.GET("/docs", docsHandler.ServeDocsUI)
	r.GET("/docs/openapi.yaml", docsHandler.ServeOpenAPISpec)
	r.GET("/docs/css", docsHandler.ServeDocsCSS)
	r.GET("/docs/js", docsHandler.ServeDocsJS)

	// API routes
	api := r.Group("/api/v1")
	{
		// Validator routes
		validators := api.Group("/validators")
		{
			validators.GET("", validatorHandler.GetAllValidators)
			validators.GET("/:type", validatorHandler.GetValidatorByType)
			validators.GET("/:type/events", validatorHandler.GetValidatorEvents)
			validators.GET("/:type/events/:eventType", validatorHandler.GetValidatorEventsByType)
			validators.GET("/:type/events/blocks/:start/:end", validatorHandler.GetValidatorEventsByBlockRange)
			validators.GET("/:type/stats", validatorHandler.GetValidatorStats)
		}

		// Event routes
		events := api.Group("/events")
		{
			events.GET("", eventHandler.GetAllEvents)
			events.GET("/:eventType", eventHandler.GetEventsByType)
			events.GET("/blocks/:start/:end", eventHandler.GetEventsByBlockRange)
			events.GET("/category/:category", eventHandler.GetEventsByCategory)
			events.GET("/validator/:stash", eventHandler.GetEventsByValidator)
			events.GET("/stats", eventHandler.GetEventStats)
		}

		// System routes
		api.GET("/health", healthCheck)
	}

	return r
}

func healthCheck(c *gin.Context) {
	response.Success(c, map[string]interface{}{
		"status":  "healthy",
		"service": "blockchain-data-api",
		"version": "1.0.0",
	})
}
