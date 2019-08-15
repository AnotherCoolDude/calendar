package event

import (
	"sync"
	"time"

	"github.com/rs/xid"
)

var (
	events []Event
	mtx    sync.RWMutex
	once   sync.Once
)

func init() {
	once.Do(initialiseEvents)
}

func initialiseEvents() {
	events = []Event{}
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
	return events
}

// Add adds a new event to the calendar and returns its ID
func Add(title string) string {
	e := newEventToday(title)
	mtx.Lock()
	events = append(events, e)
	mtx.Unlock()
	return e.ID
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
