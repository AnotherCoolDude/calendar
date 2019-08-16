import { Component, OnInit } from '@angular/core';
import { CalendarEventsService } from '../../services/calendar-events.service';
import { CalendarEvent } from '../../models/calendarEvent';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: CalendarEvent[];

  constructor(private eventService: CalendarEventsService) { }

  ngOnInit() {
    this.eventService.getDummyEvents().subscribe(events => {
      this.events = events;
    });
  }

}
