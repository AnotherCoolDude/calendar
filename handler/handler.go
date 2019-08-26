package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/AnotherCoolDude/calendar/event"
	"github.com/gin-gonic/gin"
)

// GetEventsHandler returns all events
func GetEventsHandler(c *gin.Context) {
	c.JSON(http.StatusOK, event.Get())
}

// GetDummysEventsHandler returns dummy events
func GetDummysEventsHandler(c *gin.Context) {
	c.JSON(http.StatusOK, event.GetDummys())
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

// DeleteDummyEventHandler deletes the event with given id
func DeleteDummyEventHandler(c *gin.Context) {
	id := c.Query("id")
	res := event.DeleteDummy(id)
	if res == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"requsted_id": id})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted_id": res})
}

// AddDummyEventHandler adds a new event to the dummy events
func AddDummyEventHandler(c *gin.Context) {
	e, code, err := eventFromRequest(c.Request)

	if err != nil {
		c.JSON(code, err)
		return
	}
	c.JSON(code, gin.H{"id": event.AddDummy(e)})
}

// UpdateDummyEventHandler updates the dummy event
func UpdateDummyEventHandler(c *gin.Context) {
	e, code, err := eventFromRequest(c.Request)

	if err != nil {
		c.JSON(code, err)
		return
	}
	c.JSON(code, gin.H{"id": event.UpdateDummy(e)})
}

func eventFromRequest(req *http.Request) (event.Event, int, error) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Println("[handler.go] couldn't read request body")
		return event.Event{}, http.StatusBadRequest, err
	}
	defer req.Body.Close()

	var e event.Event
	err = json.Unmarshal(body, &e)
	fmt.Printf("[handler.go] new event received: %+v\n", e)
	if err != nil {
		fmt.Println("[handler.go] couldn't unmarshal request body")
		return event.Event{}, http.StatusBadRequest, err
	}
	e.GenerateID()
	return e, http.StatusOK, nil
}
