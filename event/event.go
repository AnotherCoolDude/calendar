package event

import (
	"database/sql"
	"fmt"
	"sync"
	"time"

	"github.com/AnotherCoolDude/calendar/database"

	"github.com/rs/xid"
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
	ID        string    `json:"id,omitempty"`
	StartDate time.Time `json:"startDate,omitempty"`
	EndDate   time.Time `json:"endDate,omitempty"`
	Title     string    `json:"title"`
}

// Get returns all events
func Get() []Event {
	ee := getEventsFromDatabase()
	fmt.Println(ee)
	return ee
}

// Add adds a new event to the calendar and returns its ID
func Add(event Event) string {
	mtx.Lock()
	events = append(events, event)
	addEventToDatabase(&event)
	mtx.Unlock()
	return event.ID
}

// CloseDBConnection closes the connection to the database
func CloseDBConnection() {
	cdb.Close()
}

func newEventToday(title string) Event {
	return newEvent(time.Now(), time.Now(), title)
}

func newEvent(startDate, endDate time.Time, title string) Event {
	return Event{
		ID:        xid.New().String(),
		StartDate: startDate,
		EndDate:   endDate,
		Title:     title,
	}
}

func addEventToDatabase(event *Event) int64 {
	sdString := event.StartDate.Format("2006-01-02 15:04:05")
	edString := event.EndDate.Format("2006-01-02 15:04:05")
	id, err := cdb.Insert(event.ID, event.Title, sdString, edString)
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
			err := rows.Scan(&e.ID, &e.Title, &e.StartDate, &e.EndDate)
			if err != nil {
				rows.Close()
				return err
			}
			fmt.Printf("%+v\n", e)
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
