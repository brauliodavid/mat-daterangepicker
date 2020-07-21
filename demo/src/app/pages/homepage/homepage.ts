import {Component, NgModule, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FooterModule} from '../../shared/footer/footer';
import {RouterModule, Routes} from '@angular/router';
import {ComponentPageTitle} from '../page-title/page-title';
import {NavigationFocusModule} from '../../shared/navigation-focus/navigation-focus';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarkdownModule } from 'ngx-markdown';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDaterangepickerModule } from 'mat-daterangepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class Homepage implements OnInit {
	isNextVersion = location.hostname.startsWith('next.material.angular.io');

	formOptions = new FormGroup({
		dualView: new FormControl(true),
		applyButton: new FormControl(true),
		touchUi: new FormControl(false),
		showCustomRanges: new FormControl(false)
	})

	startDate = null
	endDate = null

	minDate = new Date(2020, 7, 13);
  	maxDate = new Date(2020, 9, 18);

	html = `
	\`\`\`html
	<div class="example-daterangepicker">
		<mat-form-field>
			<input matInput [matDatepicker]="dpRange" type="text" [value]="startDate" placeholder="Start Date">
			<mat-daterangepicker #dpRange></mat-daterangepicker>
		</mat-form-field>
		<mat-form-field>
			<input matInput [matDaterangepickerEnd]="dpRange" type="text" [value]="endDate" placeholder="End Date">
			<mat-datepicker-toggle matSuffix [for]="dpRange"></mat-datepicker-toggle>
		</mat-form-field>
	</div>
	\`\`\`
	`;

	ts = `
	\`\`\`typescript
	export class DaterangepickerExampleComponent {
		startDate = new Date()
		endDate = new Date()
	}
	\`\`\`
	`;

	css = `
	\`\`\`css
	.example-daterangepicker {
		display: flex;
	}
	\`\`\`
	`;
	

	constructor(public _componentPageTitle: ComponentPageTitle) {}

	ngOnInit(): void {
		this._componentPageTitle.title = '';
	}
}

const routes: Routes = [ {path: '', component: Homepage}];

@NgModule({
  imports: [
	CommonModule,
    ReactiveFormsModule,
	FormsModule,
	MatButtonModule,
	FooterModule,
	RouterModule.forChild(routes),
	MatDatepickerModule,
	NavigationFocusModule,
	MatDaterangepickerModule,
	MatFormFieldModule,
	MatCheckboxModule,
	MatInputModule,
	MarkdownModule,
	MatTabsModule
  ],
  exports: [Homepage],
  declarations: [Homepage],
})
export class HomepageModule {
}
