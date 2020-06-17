import { ComponentFactoryResolver, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule} from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal'
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import {
  MatDatepickerModule,
  MatDatepicker,
  MatDatepickerToggle,
  MatDatepickerContent,
  MatCalendar,
  MatMonthView,
  MatCalendarBody,
  MatCalendarHeader  
} from '@angular/material/datepicker';

import { MatDaterangepicker } from './datepicker/datepicker.component';
import { MatDaterangepickerInputEnd } from './datepicker/datepicker-input.directive';
import { MatDaterangepickerContent } from './datepicker-content/datepicker-content.component';
import { MatDaterangeCalendar } from './calendar/calendar.component';
import { MatDaterangeMonthView } from './month-view/month-view.component';
import { MatDaterangeCalendarBody } from './calendar-body/calendar-body.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    A11yModule,
    PortalModule,
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    MatDaterangepicker,
    MatDaterangepickerInputEnd,
    MatDaterangepickerContent,
    MatDaterangeCalendar,
    MatDaterangeMonthView,
    MatDaterangeCalendarBody
  ],
  exports: [
    MatDaterangepicker,
    MatDaterangepickerInputEnd,
    MatDaterangepickerContent
  ],
  entryComponents: [
    // MatDatepicker,
    // MatDatepickerToggle,
    // MatDatepickerContent,
    // MatCalendar,
    // MatMonthView,
    // MatCalendarBody,
    // MatCalendarHeader,

    MatDaterangepickerContent
  ]
})
export class MatDaterangepickerModule {
  constructor(cf: ComponentFactoryResolver, injector: Injector) {
    // this is a workaround to ensure CSS/HTML from mat datepicker is loaded, otherwise it is omitted.
    cf.resolveComponentFactory(MatDatepicker).create(injector);
    cf.resolveComponentFactory(MatDatepickerContent).create(injector);
    cf.resolveComponentFactory(MatCalendar).create(injector);
    cf.resolveComponentFactory(MatMonthView).create(injector);
    cf.resolveComponentFactory(MatCalendarBody).create(injector);
    cf.resolveComponentFactory(MatDatepickerToggle).create(injector);
  }
}
