import * as moment from 'moment';

export class CalendarEvent {
    id: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    title: string;
}
