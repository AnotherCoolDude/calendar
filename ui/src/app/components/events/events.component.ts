import { Component, OnInit } from '@angular/core';
import { CalendarEventsService } from '../../services/calendar-events.service';
import { CalendarEvent } from '../../models/calendarEvent';
import { log } from 'util';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: CalendarEvent[];
  newEvent: string;
  startDateValue: Date;
  endDateValue: Date;

  constructor(private eventService: CalendarEventsService) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  getDummyEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  addEvent() {
    if (typeof this.startDateValue === 'undefined' || typeof this.endDateValue === 'undefined') {
      return;
    }
    log(`${this.startDateValue}`);
    log(`${this.endDateValue}`);
    const e = new CalendarEvent();
    e.title = this.newEvent;
    e.startDate = this.startDateValue;
    e.endDate = this.endDateValue;
    log(JSON.stringify(e));
    this.eventService.addEvent(e).subscribe(() => {
      this.getEvents();
    });
  }

}
