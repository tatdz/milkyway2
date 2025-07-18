package handlers

import (
	"embed"
	"html/template"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v3"
)

//go:embed templates/*
var templates embed.FS

// DocsHandler handles API documentation requests
type DocsHandler struct {
	openAPISpec []byte
}

// NewDocsHandler creates a new documentation handler
func NewDocsHandler() (*DocsHandler, error) {
	// Read the OpenAPI spec file
	specData, err := os.ReadFile("docs/openapi.yaml")
	if err != nil {
		return nil, err
	}

	return &DocsHandler{
		openAPISpec: specData,
	}, nil
}

// ServeOpenAPISpec serves the raw OpenAPI specification
func (h *DocsHandler) ServeOpenAPISpec(c *gin.Context) {
	c.Header("Content-Type", "application/yaml")
	c.Data(http.StatusOK, "application/yaml", h.openAPISpec)
}

// ServeDocsUI serves the interactive API documentation UI
func (h *DocsHandler) ServeDocsUI(c *gin.Context) {
	// Parse the YAML spec to get endpoint information
	var spec map[string]interface{}
	if err := yaml.Unmarshal(h.openAPISpec, &spec); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse OpenAPI spec"})
		return
	}

	// Extract paths and info from the spec
	paths, _ := spec["paths"].(map[string]interface{})
	info, _ := spec["info"].(map[string]interface{})

	// Prepare data for the template
	data := gin.H{
		"title":       info["title"],
		"description": info["description"],
		"version":     info["version"],
		"paths":       paths,
		"baseURL":     "http://localhost:8080",
	}

	// Parse and execute the template
	tmpl, err := template.ParseFS(templates, "templates/docs.html")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load template"})
		return
	}

	c.Header("Content-Type", "text/html")
	tmpl.Execute(c.Writer, data)
}

// ServeDocsCSS serves the CSS for the documentation UI
func (h *DocsHandler) ServeDocsCSS(c *gin.Context) {
	c.Header("Content-Type", "text/css")
	c.String(http.StatusOK, `
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			line-height: 1.6;
			color: #333;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			min-height: 100vh;
		}

		.container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 20px;
		}

		.header {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(10px);
			border-radius: 20px;
			padding: 30px;
			margin-bottom: 30px;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
			text-align: center;
		}

		.header h1 {
			font-size: 2.5rem;
			color: #2d3748;
			margin-bottom: 10px;
			font-weight: 700;
		}

		.header p {
			font-size: 1.1rem;
			color: #718096;
			margin-bottom: 20px;
		}

		.version {
			display: inline-block;
			background: #4299e1;
			color: white;
			padding: 5px 15px;
			border-radius: 20px;
			font-size: 0.9rem;
			font-weight: 600;
		}

		.endpoints {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
			gap: 20px;
			margin-bottom: 30px;
		}

		.endpoint-card {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(10px);
			border-radius: 15px;
			padding: 25px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
			transition: transform 0.3s ease, box-shadow 0.3s ease;
		}

		.endpoint-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
		}

		.method {
			display: inline-block;
			padding: 4px 12px;
			border-radius: 6px;
			font-size: 0.8rem;
			font-weight: 600;
			text-transform: uppercase;
			margin-bottom: 10px;
		}

		.method.get {
			background: #68d391;
			color: white;
		}

		.method.post {
			background: #4299e1;
			color: white;
		}

		.method.put {
			background: #f6ad55;
			color: white;
		}

		.method.delete {
			background: #fc8181;
			color: white;
		}

		.path {
			font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
			font-size: 1rem;
			color: #2d3748;
			margin-bottom: 10px;
			word-break: break-all;
		}

		.summary {
			font-size: 1.1rem;
			font-weight: 600;
			color: #2d3748;
			margin-bottom: 8px;
		}

		.description {
			color: #718096;
			margin-bottom: 15px;
			line-height: 1.5;
		}

		.copy-btn {
			background: #4299e1;
			color: white;
			border: none;
			padding: 8px 16px;
			border-radius: 6px;
			cursor: pointer;
			font-size: 0.9rem;
			transition: background 0.3s ease;
		}

		.copy-btn:hover {
			background: #3182ce;
		}

		.copy-btn.copied {
			background: #68d391;
		}

		.try-btn {
			background: #38a169;
			color: white;
			border: none;
			padding: 8px 16px;
			border-radius: 6px;
			cursor: pointer;
			font-size: 0.9rem;
			margin-left: 10px;
			transition: background 0.3s ease;
		}

		.try-btn:hover {
			background: #2f855a;
		}

		.actions {
			display: flex;
			gap: 10px;
			margin-top: 15px;
		}

		.footer {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: blur(10px);
			border-radius: 15px;
			padding: 20px;
			text-align: center;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		}

		.footer p {
			color: #718096;
			margin-bottom: 10px;
		}

		.footer a {
			color: #4299e1;
			text-decoration: none;
			font-weight: 600;
		}

		.footer a:hover {
			text-decoration: underline;
		}

		@media (max-width: 768px) {
			.container {
				padding: 10px;
			}

			.header h1 {
				font-size: 2rem;
			}

			.endpoints {
				grid-template-columns: 1fr;
			}

			.endpoint-card {
				padding: 20px;
			}
		}

		.toast {
			position: fixed;
			top: 20px;
			right: 20px;
			background: #68d391;
			color: white;
			padding: 15px 25px;
			border-radius: 8px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
			transform: translateX(100%);
			transition: transform 0.3s ease;
			z-index: 1000;
		}

		.toast.show {
			transform: translateX(0);
		}
	`)
}

// ServeDocsJS serves the JavaScript for the documentation UI
func (h *DocsHandler) ServeDocsJS(c *gin.Context) {
	c.Header("Content-Type", "application/javascript")
	c.String(http.StatusOK, `
		document.addEventListener('DOMContentLoaded', function() {
			// Copy functionality
			document.querySelectorAll('.copy-btn').forEach(btn => {
				btn.addEventListener('click', function() {
					const path = this.getAttribute('data-path');
					const method = this.getAttribute('data-method');
					const baseURL = 'http://localhost:8080';
					const fullURL = baseURL + path;
					
					navigator.clipboard.writeText(fullURL).then(() => {
						// Update button text
						const originalText = this.textContent;
						this.textContent = 'Copied!';
						this.classList.add('copied');
						
						// Show toast
						showToast('URL copied to clipboard!');
						
						// Reset button after 2 seconds
						setTimeout(() => {
							this.textContent = originalText;
							this.classList.remove('copied');
						}, 2000);
					}).catch(err => {
						console.error('Failed to copy: ', err);
						showToast('Failed to copy URL');
					});
				});
			});

			// Try functionality
			document.querySelectorAll('.try-btn').forEach(btn => {
				btn.addEventListener('click', function() {
					const path = this.getAttribute('data-path');
					const method = this.getAttribute('data-method');
					const baseURL = 'http://localhost:8080';
					const fullURL = baseURL + path;
					
					// Open in new tab
					window.open(fullURL, '_blank');
				});
			});
		});

		function showToast(message) {
			// Remove existing toast
			const existingToast = document.querySelector('.toast');
			if (existingToast) {
				existingToast.remove();
			}

			// Create new toast
			const toast = document.createElement('div');
			toast.className = 'toast';
			toast.textContent = message;
			document.body.appendChild(toast);

			// Show toast
			setTimeout(() => {
				toast.classList.add('show');
			}, 100);

			// Hide toast after 3 seconds
			setTimeout(() => {
				toast.classList.remove('show');
				setTimeout(() => {
					toast.remove();
				}, 300);
			}, 3000);
		}
	`)
}
