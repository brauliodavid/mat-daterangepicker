/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code adds simple logic for a 2nd input, combined with minimal changes in the
    datepicker component, the work is done there so in native implementation this should have
    minimal changes, perhaps using dedicated input without min/max/filter etc... which are only
    set on the 1st input
*/

import { Directive, forwardRef, Optional, Input, Inject, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';

import { MatDaterangepicker } from './datepicker.component';
import { Subscription } from 'rxjs';

export const SG_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatDaterangepickerInputEnd),
  multi: true
};


export const SG_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MatDaterangepickerInputEnd),
  multi: true
};


@Directive({
  selector: '[matDaterangepickerEnd]',
  providers: [
    SG_DATEPICKER_VALUE_ACCESSOR,
    SG_DATEPICKER_VALIDATORS,
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDaterangepickerInputEnd},
  ],
  host: {
    '[attr.aria-haspopup]': 'true',
    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'MatDaterangepickerInputEnd',
})
export class MatDaterangepickerInputEnd<D> extends MatDatepickerInput<D> implements AfterViewInit, OnDestroy {
	@Input()
	set matDaterangepickerEnd(value: MatDaterangepicker<D>) {
		if (this._datepicker !== value) {
			this.unregister();
			this._datepicker = value;
			value._registerInputRangeEnd(this);
		}
	}

	private get _matDaterangepickerEnd() : MatDaterangepicker<D> {
		return <any> this._datepicker;
	}

	private _matDatepickerSubscription = Subscription.EMPTY;
	private _drCvaOnChange: (value: any) => void = () => {};

	private _drDatepickerClearSubscription = Subscription.EMPTY;

	constructor(private _drElementRef: ElementRef,
				@Optional() public _drDateAdapter: DateAdapter<D>,
				@Optional() @Inject(MAT_DATE_FORMATS) private _drDateFormats: MatDateFormats,
				@Optional() private _drFormField: MatFormField) {
		super(_drElementRef, _drDateAdapter, _drDateFormats, _drFormField); 
	}

	ngAfterViewInit(){
		// Object.defineProperty(this, 'value', {
		//   set: function (value: D | null) {
		//     if(!this._matDaterangepickerEnd.applyButton){
		//       console.log('end '+value)
		//       return;
		//     }
		//     value = this._dateAdapter.deserialize(value);
		//     this._lastValueValid = !value || this._dateAdapter.isValid(value);
		//     value = this._getValidDateOrNull(value);
		//     const oldDate = this.value;
		//     this['_assignValue'](value);
		//     this['_formatValue'](value);

		//     if (!this._dateAdapter.sameDate(oldDate, value)) {
		//       this._valueChange.emit(value);
		//     }
		//   }
		// })
	}

	ngAfterContentInit() {
		if (this._datepicker) {
			this._matDatepickerSubscription = this._matDaterangepickerEnd._selectedChangedRangeEnd.subscribe((selected: D) => {
				this.value = selected;
				this._drCvaOnChange(selected);
				this._onTouched();
				this.dateInput.emit(new MatDatepickerInputEvent(this, this._drElementRef.nativeElement));
				this.dateChange.emit(new MatDatepickerInputEvent(this, this._drElementRef.nativeElement));
			})

			//runs every clear range end
			this._drDatepickerClearSubscription = this._matDaterangepickerEnd._clearRangeEnd.subscribe(() => {
				this.value = null
				this._drCvaOnChange(null);
			})
		}
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.unregister();
		this._matDatepickerSubscription.unsubscribe();
		this._drDatepickerClearSubscription.unsubscribe();
	}

	// Implemented as part of ControlValueAccessor.
	registerOnChange(fn: (value: any) => void): void {
		this._drCvaOnChange = fn;
		super.registerOnChange(fn);
	}

	private unregister(): void {
		if (this._matDaterangepickerEnd) {
			this._matDaterangepickerEnd._unregisterInputRangeEnd(this);
		}
	}
}
