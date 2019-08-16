package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/AnotherCoolDude/calendar/event"
	"github.com/gin-gonic/gin"
	"github.com/rs/xid"
)

// GetEventsHandler returns all events
func GetEventsHandler(c *gin.Context) {
	c.JSON(http.StatusOK, event.Get())
}

// AddEventHandler adds a new event to events
func AddEventHandler(c *gin.Context) {
	e, code, err := eventFromRequest(c.Request)

	if err != nil {
		c.JSON(code, err)
		return
	}
	c.JSON(code, gin.H{"id": event.Add(e)})
}

func eventFromRequest(req *http.Request) (event.Event, int, error) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.Println("[handler.go] couldn't read request body")
		return event.Event{}, http.StatusBadRequest, err
	}
	defer req.Body.Close()

	var e event.Event
	err = json.Unmarshal(body, &e)
	fmt.Printf("%+v\n", e)
	if err != nil {
		log.Println("[handler.go] couldn't unmarshal request body")
		return event.Event{}, http.StatusBadRequest, err
	}
	e.ID = xid.New().String()
	return e, http.StatusOK, nil
}
