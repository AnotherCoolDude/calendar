import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseCalendarEvent } from '../models/databaseCalendarEvent';
import { CalendarEvent } from 'node_modules/angular-calendar/angular-calendar';
import { environment } from 'src/environments/environment';
import { DeclareVarStmt } from '@angular/compiler';
import { Data } from '@angular/router';

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

  getCalendarEvents(): Observable<DatabaseCalendarEvent[]> {
    return this.httpClient.get(environment.gateway + '/devent').pipe(
      map((data: any[]) => {
        const dces: DatabaseCalendarEvent[] = [];
        for (const d of data) {
          console.log(d);
          const dce = new DatabaseCalendarEvent(d);
          dces.push(dce);
        }
        return dces;
      })
    );
  }

  addCalendarEvent(event: DatabaseCalendarEvent): Observable<string> {
    return this.httpClient.post<string>(environment.gateway + '/devent', event.dbObject(), this.httpOptions);
  }

}
