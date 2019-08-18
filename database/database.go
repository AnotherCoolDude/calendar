package database

import (
	"database/sql"
	"fmt"

	// anonym to deny access on variables
	_ "github.com/go-sql-driver/mysql"
)

// CalendarDatabase wraps a database in a struct
type CalendarDatabase struct {
	db *sql.DB
}

// Connect connects to table from database
func Connect() (*CalendarDatabase, error) {
	db, err := sql.Open("mysql", "root:a9V7-dF4@tcp(localhost)/test_calendar?parseTime=true")
	if err != nil {
		fmt.Println("could not open database")
		return &CalendarDatabase{}, err
	}
	return &CalendarDatabase{db: db}, nil
}

// Close closes the database
func (cdb *CalendarDatabase) Close() error {
	err := cdb.db.Close()
	if err != nil {
		fmt.Println("couldn't close database")
		return err
	}
	return nil
}

// Get returns all items with id
func (cdb *CalendarDatabase) Get(property, searchstring string, rowsFunc func(rows *sql.Rows) error) error {
	var searchQuery string
	var rows *sql.Rows
	var err error
	if property == "" {
		searchQuery = "SELECT * FROM events"
		rows, err = cdb.db.Query(searchQuery)
	} else {
		searchQuery = fmt.Sprintf("SELECT * FROM events WHERE %s = ?", property)
		rows, err = cdb.db.Query(searchQuery, searchstring)
	}
	if err != nil {
		fmt.Printf("could not find an item with property %s that matches %s\n", property, searchstring)
		return err
	}
	defer rows.Close()
	err = rowsFunc(rows)
	if err != nil {
		fmt.Println("error scanning rows")
		return err
	}
	return nil
}

// Insert adds a new event to the database
func (cdb *CalendarDatabase) Insert(values ...string) (int64, error) {
	stmtString := "INSERT INTO events VALUES ("
	interfaceValues := make([]interface{}, len(values))
	for i, v := range values {
		stmtString += "?,"
		interfaceValues[i] = v
	}
	stmtString = stmtString[:len(stmtString)-1] + ")"
	fmt.Println(stmtString)
	stmt, err := cdb.db.Prepare(stmtString)
	if err != nil {
		fmt.Println("couldn't prepare statement")
		return 0, err
	}
	res, err := stmt.Exec(interfaceValues...)
	if err != nil {
		fmt.Println("couldn't execute statement")
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		fmt.Println("couldn't determine id")
		return 0, err
	}
	return id, nil
}
