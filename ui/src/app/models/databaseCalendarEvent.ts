import { CalendarEventAction, CalendarEvent } from 'angular-calendar/angular-calendar';

export class DatabaseCalendarEvent implements CalendarEvent {
    id: string;
    start: Date;
    end: Date;
    title: string;
    color: {primary: string, secondary: string};

    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;

    constructor(dbResponse?: any) {
        if (dbResponse) {
        this.id = dbResponse.id;
        this.start = new Date(dbResponse.startDate);
        this.end = new Date(dbResponse.endDate);
        this.title = dbResponse.title;
        this.color = {primary: dbResponse.primaryColor, secondary: dbResponse.secondaryColor};
        }
    }

    dbObject(): any {
        return {
            id: this.id,
            startDate: this.start,
            endDate: this.end,
            title: this.title,
            primaryColor: this.color.primary,
            secondaryColor: this.color.secondary,
        };
    }
}


