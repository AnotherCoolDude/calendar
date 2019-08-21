import { CalendarEvent } from 'angular-calendar/angular-calendar';

export class DatabaseCalendarEvent implements CalendarEvent {
    id: string;
    start: Date;
    end: Date;
    startDate: Date;
    endDate: Date;
    title: string;
    primaryColor: string = '';
    secondaryColor: string = '';
    color: {primary: string, secondary: string};

    set primaryColor() {
        this.color.primary = this.primaryColor;
    }

    set secondaryColor() {
        this.color.secondary = this.secondaryColor;
    }
    
}
