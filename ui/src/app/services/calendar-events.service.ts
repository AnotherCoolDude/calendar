import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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

  private notificationSource = new Subject<Change>();
  notification = this.notificationSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  getCalendarEvents(): Observable<DatabaseCalendarEvent[]> {
    return this.httpClient.get(environment.gateway + '/devent').pipe(
      map((data: any[]) => {
        const dces: DatabaseCalendarEvent[] = [];
        for (const d of data) {
          // console.log(d);
          const dce = new DatabaseCalendarEvent(d);
          dces.push(dce);
        }
        return dces;
      })
    );
  }

  addCalendarEvent(event: DatabaseCalendarEvent): Observable<string> {
    this.notificationSource.next(Change.Add);
    return this.httpClient.post<string>(environment.gateway + '/devent', event.dbObject(), this.httpOptions);
  }

  deleteCalendarEvent(event: DatabaseCalendarEvent): Observable<any> {
    this.notificationSource.next(Change.Delete);
    return this.httpClient.delete<string>(environment.gateway + '/devent', {params: {['id']: event.id}});
  }

}

export enum Change {
  Add = 'Add',
  Delete = 'Delete',
  Update = 'Update',
}
