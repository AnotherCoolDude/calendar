import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CalMonthViewComponent } from './components/cal-month-view/cal-month-view.component';
import { EventsComponent } from './components/events/events.component';


const routes: Routes = [
  {path: 'events', component: EventsComponent},
  {path: 'calendar', component: CalMonthViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
