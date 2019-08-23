package event

import (
	"database/sql"
	"fmt"
	"github.com/rs/xid"
	"sync"
	"time"

	"github.com/AnotherCoolDude/calendar/database"
)

var (
	cdb    *database.CalendarDatabase
	events []Event
	mtx    sync.RWMutex
	once   sync.Once
)

func init() {
	once.Do(initialiseEvents)
}

func initialiseEvents() {
	events = []Event{}
	var err error
	cdb, err = database.Connect()
	if err != nil {
		panic(err)
	}
}

// Event represents a event in a calendar
type Event struct {
	ID             string    `json:"id"`
	StartDate      time.Time `json:"startDate"`
	EndDate        time.Time `json:"endDate"`
	Title          string    `json:"title"`
	PrimaryColor   string    `json:"primaryColor"`
	SecondaryColor string    `json:"secondaryColor"`
}

// GenerateID generates a new id for e
func (e *Event) GenerateID() {
	e.ID = xid.New().String()
}

// Get returns all events
func Get() []Event {
	ee := getEventsFromDatabase()
	fmt.Println(ee)
	return ee
}

// GetDummyEvents returns dummy events for testing purposes
func GetDummyEvents() []Event {
	if len(events) == 0 {
		events = []Event{
			Event{
				ID:             xid.New().String(),
				StartDate:      time.Now(),
				EndDate:        time.Now().Add(2 * 24 * time.Hour),
				Title:          "first dummy event",
				PrimaryColor:   "#ad2121",
				SecondaryColor: "#FAE3E3",
			},
			Event{
				ID:             xid.New().String(),
				StartDate:      time.Now().Add(3 * 24 * time.Hour),
				EndDate:        time.Now().Add(4 * 24 * time.Hour),
				Title:          "second dummy event",
				PrimaryColor:   "#1e90ff",
				SecondaryColor: "#D1E8FF",
			},
			Event{
				ID:             xid.New().String(),
				StartDate:      time.Now().Add(6 * 24 * time.Hour),
				EndDate:        time.Now().Add(6 * 24 * time.Hour),
				Title:          "third dummy event",
				PrimaryColor:   "#e3bc08",
				SecondaryColor: "#FDF1BA",
			},
		}
	}
	return events
}

// Add adds a new event to the calendar and returns its ID
func Add(event Event) string {
	mtx.Lock()
	addEventToDatabase(&event)
	mtx.Unlock()
	return event.ID
}

// AddDummyEvent adds a new dummy event to events
func AddDummyEvent(event Event) string {
	mtx.Lock()
	events = append(events, event)
	mtx.Unlock()
	return event.ID
}

// CloseDBConnection closes the connection to the database
func CloseDBConnection() {
	cdb.Close()
}

// Delete deletes a event identified by id
func Delete(id string) {

}

// DeleteDummy deletes a dummy event identified by id
func DeleteDummy(id string) string {
	mtx.Lock()
	for idx, e := range events {
		if e.ID == id {
			events = append(events[:idx], events[idx+1:]...)
			mtx.Unlock()
			return id
		}
	}
	mtx.Unlock()
	return ""
}

func addEventToDatabase(event *Event) int64 {
	sdString := event.StartDate.Format("2006-01-02 15:04:05")
	edString := event.EndDate.Format("2006-01-02 15:04:05")
	id, err := cdb.Insert(event.ID, event.Title, sdString, edString, event.PrimaryColor, event.SecondaryColor)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	return id
}

func getEventsFromDatabase() []Event {
	events := []Event{}
	err := cdb.Get("", "", func(rows *sql.Rows) error {
		for rows.Next() {
			var e Event
			err := rows.Scan(&e.ID, &e.Title, &e.StartDate, &e.EndDate, &e.PrimaryColor, &e.SecondaryColor)
			if err != nil {
				rows.Close()
				return err
			}
			events = append(events, e)
		}
		rows.Close()
		return nil
	})
	if err != nil {
		fmt.Println(err)
		return events
	}
	return events
}
