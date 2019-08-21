import { Component, OnInit } from '@angular/core';
import { CalendarEventsService } from '../../services/calendar-events.service';
import { CalendarEvent } from 'node_modules/angular-calendar/angular-calendar';
import { DatabaseCalendarEvent } from '../../models/databaseCalendarEvent';
import * as moment from 'moment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: DatabaseCalendarEvent[];
  newEvent: string;
  startDateValue: Date;
  endDateValue: Date;

  constructor(private eventService: CalendarEventsService) { }

  ngOnInit() {
    this.getEvents();
  }

  format(m: Date): string {
    return moment(m.toString()).format('D. MMMM YYYY HH:mm');
  }

  getEvents() {
    this.eventService.getCalendarEvents().subscribe(events => {
      this.events = events;
    });
  }

  addEvent() {
    if (typeof this.startDateValue === 'undefined' || typeof this.endDateValue === 'undefined') {
      return;
    }
    const e = new DatabaseCalendarEvent();
    e.id = '';
    e.title = this.newEvent;
    e.start = this.startDateValue;
    e.end = this.endDateValue;
    e.color = {primary: '#1e90ff', secondary: '#D1E8FF'};
    this.eventService.addCalendarEvent(e).subscribe(() => {
      this.getEvents();
    });
  }

}
