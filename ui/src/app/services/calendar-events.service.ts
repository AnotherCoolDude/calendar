import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent } from '../models/calendarEvent';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  // getDummyEvents(): Observable<CalendarEvent[]> {
  //   const events: CalendarEvent[] = [];
  //   for (let i = 0; i < 3; i++) {
  //     const c = new CalendarEvent();
  //     c.id = `${i}`;
  //     c.title = 'Hallo';
  //     c.startDate = new Date();
  //     c.endDate = new Date();
  //     events.push(c);
  //   }
  //   return new Observable<CalendarEvent[]>(subscriber => {
  //     subscriber.next(events);
  //   });
  // }

  getEvents(): Observable<CalendarEvent[]> {
    return this.httpClient.get<CalendarEvent[]>(environment.gateway + '/event');
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.httpClient.post<CalendarEvent>(environment.gateway + '/event', event, this.httpOptions);
  }

}
