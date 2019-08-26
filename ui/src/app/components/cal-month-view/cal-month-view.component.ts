import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'node_modules/angular-calendar';
import { CalendarEventsService } from '../../services/calendar-events.service';
import { Subject } from 'rxjs';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseCalendarEvent } from 'src/app/models/databaseCalendarEvent';

@Component({
  selector: 'app-cal-month-view',
  templateUrl: './cal-month-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cal-month-view.component.css']
})
export class CalMonthViewComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  viewDate: Date = new Date();
  events: DatabaseCalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  modalData: {
    action: string;
    event: DatabaseCalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: DatabaseCalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: DatabaseCalendarEvent }): void => {
        this.deleteEvent(event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  constructor(private eventService: CalendarEventsService, private modal: NgbModal) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.eventService.getCalendarEvents().subscribe(events => {
      events.forEach( e => {
        e.actions = this.actions;
        e.draggable = true;
        e.resizable = {
          beforeStart: true,
          afterEnd: true,
        };
      } );
      this.events = [];
      this.events = events;
      this.refresh.next();
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const selectedEvents = this.events.filter(dce => {return dce.id === event.id});
    if (selectedEvents.length !== 1) {
      console.log('either none or more than one events with matching id found');
      return
    }
    selectedEvents[0].start = newStart;
    selectedEvents[0].end = newEnd;
    this.updateEvent(selectedEvents[0]);
    this.handleEvent('Dropped or resized', selectedEvents[0]);
  }

  deleteEvent(eventToDelete: DatabaseCalendarEvent) {
    this.eventService.deleteCalendarEvent(eventToDelete).subscribe(resp => {
      console.log(resp);
      this.getEvents();
    });
  }

  updateEvent(eventToUpdate: DatabaseCalendarEvent) {
    this.eventService.updateCalendarEvent(eventToUpdate).subscribe(resp => {
      console.log(resp);
      this.getEvents();
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(action: string, event: DatabaseCalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
}
