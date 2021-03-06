package main

import (
	"path"

	"github.com/AnotherCoolDude/calendar/event"

	"github.com/AnotherCoolDude/calendar/handler"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(corsMiddleware())

	calendar := r.Group("/")
	calendar.GET("/event", handler.GetEventsHandler)
	calendar.POST("/event", handler.AddEventHandler)

	calendar.GET("/devent", handler.GetDummysEventsHandler)
	calendar.POST("/devent", handler.AddDummyEventHandler)
	calendar.DELETE("/devent", handler.DeleteDummyEventHandler)
	calendar.PUT("/devent", handler.UpdateDummyEventHandler)

	r.NoRoute(func(c *gin.Context) {
		dir, file := path.Split(c.Request.RequestURI)
		ext := path.Ext(file)
		if file == "" || ext == "" {
			c.File("./ui/dist/ui/index.html")
		} else {
			c.File("./ui/dist/ui/" + path.Join(dir, file))
		}
	})

	defer event.CloseDBConnection()

	if err := r.Run(":3000"); err != nil {
		panic(err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "DELETE, GET, OPTIONS, POST, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
