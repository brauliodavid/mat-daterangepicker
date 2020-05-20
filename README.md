# MatDaterangepicker

This is an extension library for the native [Angular Material Datepicker](https://material.angular.io/components/datepicker/overview). Then you can use all the options provided by the ```Matdatepicker``` material component.

[Demo](https://material.angular.io/components/datepicker/overview)

## Requirements

| Angular           | Version  |
|-------------------|----------|
| angular           | >= 9.0.0 |
| @angular/material | >= 9.0.0 |

## Installation

`npm i mat-daterangepicker`

import MatDaterangepickerModile in your module

```typescript
import { MatDaterangepickerModile } from 'mat-daterangepicker';

@NgModule({
    imports: [
        MatDaterangepickerModile
    ],
    declarations: [AppComponent],
    bootstrap:    [AppComponent]
})
export class AppModule {}
```

### Angular Material Theme

import code bellow in your material style theme to have compatibility with your current material theme.

```scss
@import 'mat-daterangepicker/mat-daterangepicker.theme.scss';

@include mat-daterangepicker-theme($theme-skin);
```

## Usage

```typescript
export class DaterangepickerExampleComponent {
    startDate = new Date()
    endDate = new Date()
}
```

```html
<mat-form-field>
    <input matInput [matDatepicker]="dpRange" type="text" [value]="startDate" placeholder="Start Date">
    <mat-daterangepicker #dpRange></mat-daterangepicker>
</mat-form-field>
<mat-form-field>
    <input matInput [matDaterangepickerEnd]="dpRange" type="text" [value]="endDate" placeholder="End Date">
    <mat-datepicker-toggle matSuffix [for]="dpRange"></mat-datepicker-toggle>
</mat-form-field>
```

## Options

| Option                              | Description                                                               |
| ----------------------------------- | ------------------------------------------------------------------------- |
| @Input() dualView: boolean          | An input to display two calendars when selecting date range               |
| @Input() applyButton: boolean       | An input to display an apply button to close the calendar picker          |
| @Input() showCustomRanges: boolean  | An input to display default custom ranges options in the calendar picker  |

### Mehods

| Method        | Description                                    |
| ------------- | ---------------------------------------------- |
| applyRange    | Apply the range and close the calendar picker  |
| clearRange    | Clear the selected dates                       |
