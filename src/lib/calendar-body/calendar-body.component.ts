/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code is marked with a comment.
*/

import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ViewChildren, QueryList, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatCalendarBody } from '@angular/material/datepicker';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: '[mat-daterange-calendar-body]',
  templateUrl: './calendar-body.component.html',
  host: {
    'class': 'mat-calendar-body',
    '[class.mat-daterange-calendar-body-range]': 'range', // RELEVANT CODE FOR NATIVE IMPLEMENTATION
    'role': 'grid',
    'attr.aria-readonly': 'true'
  },
  exportAs: 'matCalendarBody',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDaterangeCalendarBody<D> extends MatCalendarBody implements OnInit, OnDestroy {

	/* RELEVANT CODE FOR NATIVE IMPLEMENTATION - ~ 13 LOC */
	@Input() range: boolean;
	@Input() allInRange: boolean;
	@Input() selectedRangeEndValue: number;
	@Input() view: number
	@Input() createDate: any
	@Input() selected: Date | null
	@Input() selectedRangeEnd: Date | null
	@Input() setHoverCells: BehaviorSubject<any>
	@Input() clearBody: BehaviorSubject<any>
	@Input() dateAdapter: DateAdapter<D>
	@ViewChildren('Row') rowsElms: QueryList<ElementRef>

	hoverSubscription = Subscription.EMPTY
	clearBodySubscription = Subscription.EMPTY

	ngOnInit() {
		this.hoverSubscription = this.setHoverCells.subscribe(async (tmpDate: any | null) => {
			if(!tmpDate || !this.selected || this.selectedRangeEnd || (this.selected && this.selectedRangeEnd)) return;
			this._doHoverCells(tmpDate)
		})

		this.clearBodySubscription = this.clearBody.subscribe(clear => {
			if(clear){
				this._doHoverCells(null, clear)
			}
		})
	}

	_cellClass(date: number){
		if(!this.selected || !this.selectedRangeEnd) return;

		const startDate = this.selected.getTime()
		const endDate = this.selectedRangeEnd.getTime()
		const cellDate = this.createDate(date).getTime()
		
		return {
			'mat-daterange-calendar-body-in-range': cellDate >= startDate && cellDate <= endDate && startDate !== endDate,
			'mat-daterange-calendar-body-range-start': cellDate === startDate && startDate !== endDate,
			'mat-daterange-calendar-body-range-end': cellDate === endDate && startDate !== endDate
		}
	}

	_inRange(date: number) {
		// if (this.range) {
		// 	if (this.allInRange) {
		// 		return true;
		// 	}

		// 	if (this.selectedValue && !this.selectedRangeEndValue) {
		// 		return date >= this.selectedValue;
		// 	}
		// 	if (this.selectedRangeEndValue && !this.selectedValue) {
		// 		return date <= this.selectedRangeEndValue;
		// 	}
		// 	return date >= this.selectedValue && date <= this.selectedRangeEndValue;
		// }
	}

	_onHoverCell(tmpDate: number){
		if(this.selectedRangeEndValue) return;

		this.setHoverCells.next(this.createDate(tmpDate))
	}

	_doHoverCells(tmpDate?: any, clear?: boolean){
		const startDate = this.selected?.getTime()
		const endTempDate = tmpDate?.getTime()
		this.rows.map((row, r) => {
			const rowElm = this.rowsElms.toArray()[r]
			let hasLabel = false
			row.map((cell, c) => {
				let cellElm = rowElm.nativeElement.cells[hasLabel ? c + 1 : c]
				if(cellElm.classList.contains('mat-calendar-body-label')){
					hasLabel = true
					cellElm = rowElm.nativeElement.cells[c + 1]
				}
				cellElm.classList.remove('mat-daterange-calendar-body-in-range')
				cellElm.classList.remove('mat-daterange-calendar-body-range-end')
				cellElm.classList.remove('mat-daterange-calendar-body-range-start')
				if(clear) return;
				const inRange = this._inRangeTemp(cell.value, startDate, endTempDate, cellElm)
			})
		})
	}

	_inRangeTemp(date: number, startDate, endTempDate, cellElm) {
		
		const cellDate = this.createDate(date).getTime()

		if(endTempDate >= startDate){
			if(endTempDate !== startDate){
				if(cellDate === startDate){
					cellElm.classList.add('mat-daterange-calendar-body-in-range')
					cellElm.classList.add('mat-daterange-calendar-body-range-start')
				}
				if(cellDate === endTempDate){
					cellElm.classList.add('mat-daterange-calendar-body-in-range')
					cellElm.classList.add('mat-daterange-calendar-body-range-end')
				}
			}
			if(cellDate > startDate && cellDate < endTempDate){
				cellElm.classList.add('mat-daterange-calendar-body-in-range')
				return true
			}
			return false
		}else{
			if(endTempDate !== startDate){
				if(cellDate === startDate){
					cellElm.classList.add('mat-daterange-calendar-body-in-range')
					cellElm.classList.add('mat-daterange-calendar-body-range-end')
				}
				if(cellDate === endTempDate){
					cellElm.classList.add('mat-daterange-calendar-body-in-range')
					cellElm.classList.add('mat-daterange-calendar-body-range-start')
				}
			}
			if(cellDate < startDate && cellDate > endTempDate){
				cellElm.classList.add('mat-daterange-calendar-body-in-range')
				return true
			}
			return false
		}
	}

	ngOnDestroy(){
		this.hoverSubscription.unsubscribe()
		this.clearBodySubscription.unsubscribe()
	}
  
}
