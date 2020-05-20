/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The added/edited code adds logic for handling 1 or 2 inputs, i.e. range.
    When we have 2 inputs it's a range, otherwise its a single value date selection.
    The main logic is in `selectRangeEnd()` which handles range/non-range and inner range states. (this could
    probably be more orgenaized with proper states for clarity)

    Instead of "_userSelection" closing the popup/dialog from the calendar-content, the logic
    is moved here into _userSelection() which will close/keep based on range logic.
*/

import { Subject, Subscription } from 'rxjs';
import {
  Component, ChangeDetectionStrategy, Inject, Input, ViewEncapsulation, ViewContainerRef, Optional, NgZone,
  OnDestroy,
  AfterViewInit,
  OnInit,
  InjectionToken,
  Injector
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Overlay } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker, MatDatepickerInput, MAT_DATEPICKER_SCROLL_STRATEGY, MatDatepickerInputEvent } from '@angular/material/datepicker';

import { MatDaterangepickerContent } from '../datepicker-content/datepicker-content.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { take } from 'rxjs/operators';
import { DEFAULT_RANGES_DATES } from './default-ranges';

export interface CustomRange<D> {
	name: string
	startDate: D | Date
	endDate: D | Date
}

export const SG_CUSTOM_RANGES = new InjectionToken<CustomRange<any>[]>('Custom Ranges')

@Component({
  selector: 'mat-daterangepicker',
  template: '',
  exportAs: 'matDaterangepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
	{provide: SG_CUSTOM_RANGES, useValue: []},
  ]
})
export class MatDaterangepicker<D> extends MatDatepicker<D> implements OnInit, AfterViewInit, OnDestroy {

	@Input() applyButton: boolean = true
	@Input() dualView: boolean = true
	@Input() showCustomRanges: boolean = false

	customRanges = []

	/** The currently selected date. */
	get _selectedRangeEnd(): D | null { return this._validSelectedRangeEnd; }
	set _selectedRangeEnd(value: D | null) { this._validSelectedRangeEnd = value; }
	private _validSelectedRangeEnd: D | null = null;

	/** Emits new selected date when selected date changes. */
	readonly _selectedChangedRangeEnd = new Subject<D>();
	readonly _clearRangeEnd = new Subject<D>();
	_range: boolean = false;

	_datepickerInputRangeEnd: MatDatepickerInput<D>;
	private _inputRangeEndSubscription = Subscription.EMPTY;
	private _drDialog: MatDialog;

	constructor(_drDialog: MatDialog,
				private _drOverlay: Overlay,
				private _drNgZone: NgZone,
				private _drViewContainerRef: ViewContainerRef,
				@Inject(MAT_DATEPICKER_SCROLL_STRATEGY) private _drScrollStrategy,
				@Optional() public _drDateAdapter: DateAdapter<D>,
				@Optional() private _drDir: Directionality,
				@Optional() @Inject(DOCUMENT) private _drDocument: any,
				@Inject(SG_CUSTOM_RANGES) public _customRanges: CustomRange<D>[]) {
		super(
		_drDialog = Object.create(_drDialog),
		_drOverlay,
		_drNgZone,
		_drViewContainerRef,
		_drScrollStrategy,
		_drDateAdapter,
		_drDir,
		_drDocument
		);

		/*
			This is a monkey patch workaround to support a new component for dialog/popup.
			Because everything is freaking private in material, why would somone use protected anyway.
		*/
		this._drDialog = _drDialog;
		this._drDialog.open = <any> function (...args: any[]) {
			if (typeof args[0].createEmbeddedView !== 'function') {
				args[0] = MatDaterangepickerContent;
			}
			return MatDialog.prototype.open.apply(_drDialog, args);
		};

		// Object.defineProperty(this, '_calendarPortal', {
		//   get: function () { return this.__calendarPortal; },
		//   set: function (value) {
		//     this.__calendarPortal = value;
		//     if (value) {
		//       value.component = MatDaterangepickerContent;
		//     }
		//   }
		// })

		this['_openAsPopup'] = () => {
			const portal = new ComponentPortal<MatDaterangepickerContent<D>>(MatDaterangepickerContent,
			this._drViewContainerRef);

			this['_destroyPopup']();
			this['_createPopup']();
			this['_popupComponentRef'] = this['_popupRef']!.attach(portal);
			this.forwardContentValues(this['_popupComponentRef'].instance);

			// Update the position once the calendar has rendered.
			this._drNgZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
				this['_popupRef']!.updatePosition();
			});
		}
	}

	ngOnInit(){
		

		if(this.customRanges){
			this._setCustomRanges()
		}
	}

	ngAfterViewInit(){
	}

	forwardContentValues(instance: MatDaterangepickerContent<D>) {
		instance.datepicker = this;
		instance.color = this.color;
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this._inputRangeEndSubscription.unsubscribe();
	}

	selectRangeEnd(date: D): void {
		if (!this._range) {
			super.select(date);
		} else {
			if (!date) {
				if (this._selected && this._selectedRangeEnd) {
					super.select(null);
					this._selectRangeEnd(null);
				} else if (this._selected) {
					super.select(null);
				} else if (this._selectedRangeEnd) {
					this._selectRangeEnd(null);
				}
			} else if (!this._selected || this._selectedRangeEnd) {
				if (this._selectedRangeEnd) {
					this._selectRangeEnd(null);
				}
				super.select(date);
			} else {
				if (date < this._selected) {
					const swap = this._selected;
					super.select(date);
					this._selectRangeEnd(swap);
				} else if (date >= this._selected) { // notice date === this._selected is not skipped
					this._selectRangeEnd(date);
				}
			}
		}
	}

	_userSelection(): void {
		if(this.applyButton) return;

		if ( !this._range || (this._selected && this._selectedRangeEnd) ) {
			this.close();
		}
	}

	applyRange(): void {
		this.close();
	}

	clearRange(): void {
		this._datepickerInput.value = null
		this._clearRangeEnd.next()
	}

	_getViews(){
		if(this.dualView){
			return [0,1]
		}
		return  [0]
	}

	_registerInputRangeEnd(input: MatDatepickerInput<D>): void {
		if (this._datepickerInputRangeEnd) {
			throw Error('A MatDatepicker can only be associated with a single range end input.');
		}
		this._datepickerInputRangeEnd = input;
		this._range = !!input;

		this._inputRangeEndSubscription.unsubscribe();
		if (this._range) {
		this._inputRangeEndSubscription =
			this._datepickerInputRangeEnd._valueChange.subscribe((value: D | null) => this._selectedRangeEnd = value);
		}
	}

	_unregisterInputRangeEnd(input?: MatDatepickerInput<D>): void {
		if (this._datepickerInputRangeEnd) {
			if (!input || input === this._datepickerInputRangeEnd) {
				this._datepickerInputRangeEnd = undefined;
				this._range = false;
				this._inputRangeEndSubscription.unsubscribe();
			}
		}
	}

	private _selectRangeEnd(date: D): void {
		const oldValue = this._selectedRangeEnd;
		this._selectedRangeEnd = date;
		if (!this._drDateAdapter.sameDate(oldValue, this._selectedRangeEnd)) {
			this._selectedChangedRangeEnd.next(this._selectedRangeEnd);
		}
	}

	private _setCustomRanges(){
		if(this._customRanges.length){
			this.customRanges = this._customRanges
		}else{
			this.customRanges = DEFAULT_RANGES_DATES.map(range => {
				return {
					name: range.name, 
					startDate: range.startDate ? this._drDateAdapter.createDate(range.startDate.getFullYear(), range.startDate.getMonth(), range.startDate.getDate()) : null,
					endDate: range.endDate ? this._drDateAdapter.createDate(range.endDate.getFullYear(), range.endDate.getMonth(), range.endDate.getDate()) : null
				}
			})
		}
	}
}

