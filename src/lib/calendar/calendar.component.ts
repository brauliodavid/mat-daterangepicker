/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code is marked with a comment.
*/

import { Component, Input, Inject, Injector, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, Optional, ReflectiveInjector, ViewEncapsulation } from '@angular/core';

import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { ComponentPortal } from '@angular/cdk/portal';

import { MatDatepickerIntl, MatCalendar } from '@angular/material/datepicker';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mat-daterange-calendar',
  templateUrl: './calendar.component.html',
  host: {
    'class': 'mat-calendar',
  },
  exportAs: 'matDaterangeCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDaterangeCalendar<D> extends MatCalendar<D> {
	@Input() view: number
	@Input() setHoverCells: BehaviorSubject<any>
	@Input() clearBody: BehaviorSubject<any>
	
	// THIS SECTION IS JUST TO PROVIDE MatCalendar as SgCalendar to MatCalendarHeader
	constructor(_intl: MatDatepickerIntl,
				@Optional() _dateAdapter: DateAdapter<D>,
				@Optional() @Inject(MAT_DATE_FORMATS) _dateFormats: MatDateFormats,
				changeDetectorRef: ChangeDetectorRef,
				private drInjector: Injector) {
		super(_intl, _dateAdapter, _dateFormats, changeDetectorRef);
	}
	ngAfterContentInit(): void {
		super.ngAfterContentInit();    
		const injector = ReflectiveInjector.resolveAndCreate([{ provide: MatCalendar, useValue: this }], this.drInjector);

		(<ComponentPortal<any>> this._calendarHeaderPortal).injector = injector;

		const activeDate = this.startAt || this['_dateAdapter'].today();

		this.activeDate = this.view === 0 ? activeDate : this.getSecondViewActiveDate(activeDate)
	
		// Assign to the private property since we don't want to move focus on init.
		// this._currentView = this.startView;
	}

	/* RELEVANT CODE FOR NATIVE IMPLEMENTATION - ~ 10 LOC */

	@Input() range: boolean;

	@Input() get selectedRangeEnd(): D | null { return this._selectedRangeEnd; }
	set selectedRangeEnd(value: D | null) {
		this._selectedRangeEnd = (<any> this)._getValidDateOrNull( ( <any> this)._dateAdapter.deserialize(value));
	}

	@Output() readonly selectedRangeEndChange: EventEmitter<D> = new EventEmitter<D>();

	private _selectedRangeEnd: D | null;

	_dateSelectedRangeEnd(date: D): void {
		if (!(<any> this)._dateAdapter.sameDate(date, this.selectedRangeEnd)) {
			this.selectedRangeEndChange.emit(date);
		}
	}

	getSecondViewActiveDate(activeDate){
		const date = (<DateAdapter<D>>this['_dateAdapter']).getDate(activeDate)
		const month = (<DateAdapter<D>>this['_dateAdapter']).getMonth(activeDate)
		const year = (<DateAdapter<D>>this['_dateAdapter']).getYear(activeDate)
		let y, m
		if(month === 11){
			m = 0
			y = year + 1
		}else{
			m = month + 1,
			y = year
		}
		const D = (<DateAdapter<D>>this['_dateAdapter']).createDate(y, m, date)
		return D
	}
  
}
