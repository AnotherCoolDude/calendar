import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseCalendarEvent } from '../models/databaseCalendarEvent';
import { CalendarEvent } from 'node_modules/angular-calendar/angular-calendar';
import { environment } from 'src/environments/environment';

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

  getCalendarEvents(){
  //  this.httpClient.get(environment.gateway + '/event').forEach((dbevent: DatabaseCalendarEvent) => ({
  //     id: dbevent.id,
  //     title: dbevent.title,
  //     start: new Date(dbevent.startDate),
  //     end: new Date(dbevent.endDate),
  //     color: {primary: dbevent.primaryColor, secondary: dbevent.secondaryColor}
  //   })).then();

    return this.httpClient.get<DatabaseCalendarEvent[]>(environment.gateway + '/event')
      .pipe(
        map(dbevent => ({
        id: dbevent.id,
        title: dbevent.title,
        start: new Date(dbevent.startDate),
        end: new Date(dbevent.endDate),
       color: {primary: dbevent.primaryColor, secondary: dbevent.secondaryColor}
      }))
    ).subscribe(obs => {console.log(obs)});

    this.httpClient.get<DatabaseCalendarEvent[]>(environment.gateway + '/event').subscribe(events => {
      let m = events.map((event: DatabaseCalendarEvent) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        color: {primary: event.primaryColor, secondary: event.secondaryColor}
      }));
      
    });
    return new Observable<CalendarEvent[]>(subscriber => {
      subscriber.next(cEvents);
      subscriber.complete();
    });
  }

  addCalendarEvent(event: CalendarEvent): Observable<string> {
    const dbCalendarEvent = new DatabaseCalendarEvent();
    dbCalendarEvent.id = '';
    dbCalendarEvent.startDate = event.start;
    dbCalendarEvent.endDate = event.end;
    dbCalendarEvent.title = event.title;
    dbCalendarEvent.primaryColor = event.color.primary;
    dbCalendarEvent.secondaryColor = event.color.secondary;
    return this.httpClient.post<string>(environment.gateway + '/event', dbCalendarEvent, this.httpOptions);
  }

}
