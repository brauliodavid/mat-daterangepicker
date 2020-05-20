/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The added/edited code adds logic for handling range / non range mode.
    Additionaly, in range mode it will apply logic to mark the dates within the active month
    that are within the range.
    There are 3 range states for a month view, set by the combination of "_rangable" and "_allInRange":
      - Not rangable (single value datepicker OR active month not in range) - _rangable = False
      - Rangable but not all (active month is partially in range) - _rangable = True
      - All In Range (active month is in range, start/end dates before/after this month) - _rangable = True & _allInRange = True
*/


import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { MatMonthView } from '@angular/material/datepicker';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mat-daterange-month-view',
  templateUrl: './month-view.component.html',
  exportAs: 'matMonthView',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDaterangeMonthView<D> extends MatMonthView<D> {

	_selectedRangeEndDate: number | null;

	@Input() range: boolean;
	@Input() view: number
	@Input() setHoverCells: BehaviorSubject<any>
	@Input() clearBody: BehaviorSubject<any>

	@Input() get selectedRangeEnd(): D | null {
		return this._selectedRangeEnd;
	}
	set selectedRangeEnd(value: D | null) {
		this._selectedRangeEnd = (<any> this)._getValidDateOrNull((<any> this)._dateAdapter.deserialize(value));
		this._selectedRangeEndDate = (<any> this)._getDateInCurrentMonth((<any> this)._selectedRangeEnd);
	}

	get _allInRange(): boolean {
		if (!this.range || !this.activeDate || !this.selectedRangeEnd || !this.selected) {
			return false;
		} else {
			const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
			const startDate = this.createDate(1);
			const endDate = this.createDate(daysInMonth);

			return this._dateAdapter.compareDate(this.selected, startDate) < 0 &&
				this._dateAdapter.compareDate(this.selectedRangeEnd, endDate) > 0;
		}
	}

	get _rangable(): boolean {
		if (!this.range || !this._weeks) {
			return false;
		} else {
			const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
			const startDate = this.createDate(1);
			const endDate = this.createDate(daysInMonth);

			if (this.selectedRangeEnd < startDate) {
				return false;
			}

			if (this.selected > endDate) {
				return false;
			}

			return true;
		}
	}

	private _selectedRangeEnd: D | null;

	@Output() readonly selectedRangeEndChange: EventEmitter<D> = new EventEmitter<D>();

	_init() {
		this._selectedRangeEndDate = (<any> this)._getDateInCurrentMonth(this.selectedRangeEnd);
		super._init();
	}

	async _dateSelected(date: number) {
		if ( !this.range ) {
			super._dateSelected(date);
		} else {
			if ( !this.selected || this.selectedRangeEnd ) {
				if ( this._selectedRangeEnd ) {
					this._dateSelectedRangeEnd(null);
				}
				super._dateSelected(date);
			} else {
				if (date === null) {
					this._dateSelectedRangeEnd(null);
				} else {
					const selectedDate = this.createDate(date);
					if (selectedDate < this.selected) {
						// const swap = this._selectedDate;
						const year = this._dateAdapter.getYear(this.selected);
						const month = this._dateAdapter.getMonth(this.selected);
						const swap = this._dateAdapter.getDate(this.selected);
						super._dateSelected(date);
						this._dateSelectedRangeEnd(swap, year, month);
					} else {
						this._dateSelectedRangeEnd(date);
					}
				}
			}
		}
	}

	private _dateSelectedRangeEnd(date: number | null, year?, month?) {
		if (date === null) {
			this.selectedRangeEndChange.emit(null);
		} else if ( this._selectedRangeEndDate != date ) {
			let selectedDate
			if(year && month){
				selectedDate = this._dateAdapter.createDate(year, month, date);
			}else{
				selectedDate = this.createDate(date)
			}
			
			this.selectedRangeEndChange.emit(selectedDate);
			this._userSelection.emit();
		}
	}

	private createDate(date: number): D {
		const selectedYear = this._dateAdapter.getYear(this.activeDate);
		const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
		return this._dateAdapter.createDate(selectedYear, selectedMonth, date);
	}

	_createDate = (date: number): Date => {
		const selectedYear = this._dateAdapter.getYear(this.activeDate);
		const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
		return new Date(selectedYear, selectedMonth, date);
	}

	getSelectedDate(){
		if(!this.selected) return null
		const selectedYear = this._dateAdapter.getYear(this.selected);
		const selectedMonth = this._dateAdapter.getMonth(this.selected);
		const selectedDate = this._dateAdapter.getDate(this.selected);
		return new Date(selectedYear, selectedMonth, selectedDate);
	}

	getSelectedRangeEndDate(){
		if(!this.selectedRangeEnd) return null
		const selectedYear = this._dateAdapter.getYear(this.selectedRangeEnd);
		const selectedMonth = this._dateAdapter.getMonth(this.selectedRangeEnd);
		const selectedDate = this._dateAdapter.getDate(this.selectedRangeEnd);
		return new Date(selectedYear, selectedMonth, selectedDate);
	}
}

