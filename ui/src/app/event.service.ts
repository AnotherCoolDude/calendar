import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class EventService {

  constructor(private httpClient: HttpClient) { }

  getEvents() {
    return this.httpClient.get(environment.gateway + '/event');
  }

  createEvent() {
    return this.httpClient.post(environment.gateway + '/event', event);
  }

}

export class Event {
  id: string;
  startDate: Date;
  endDate: Date;
  title: string;
}
