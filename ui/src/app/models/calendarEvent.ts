import * as moment from 'moment';
import { EventColor } from 'calendar-utils';

export class CalendarEvent {
    id: string;
    start: Date;
    end: Date;
    title: string;
    color: EventColor;
}
