package main

import (
	"fmt"
	"path"

	"github.com/AnotherCoolDude/galendar/handler"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(corsMiddleware())
	fmt.Print()

	calendar := r.Group("/")
	calendar.GET("/event", handler.GetEventsHandler)
	calendar.POST("/event", handler.AddEventHandler)

	r.NoRoute(func(c *gin.Context) {
		dir, file := path.Split(c.Request.RequestURI)
		ext := path.Ext(file)
		if file == "" || ext == "" {
			c.File("./ui/dist/ui/index.html")
		} else {
			c.File("./ui/dist/ui/" + path.Join(dir, file))
		}
	})

	if err := r.Run(":3000"); err != nil {
		panic(err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")

		c.Next()
	}
}
