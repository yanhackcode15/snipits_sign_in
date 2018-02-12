import { 
	Component, 
	OnInit, 
	Input, 
	Output, 
	EventEmitter, 
	ElementRef, 
	NgZone, 
	ViewChild  
} from '@angular/core';
import {ReactiveFormsModule, 
		FormsModule, 
		FormBuilder, 
		FormControl, 
		FormGroup, 
		FormArray,
		Validators, 
		AbstractControl, 
		ValidatorFn, 
} from "@angular/forms";

@Component({
  selector: 'app-birthday-date-picker',
  template: `
  	<div 
	  	[ngClass]="{
		  				'text-danger': bodvalue.invalid && (birthDate.dirty || birthMonth.dirty || birthYear.dirty),
		  				'text-success': bodvalue.valid && (bodvalue.touched || bodvalue.dirty)	
					}"
  	>	
  		<div class="form-group input-group" [formGroup]='birthdayGroup'>
  			<label class="input-group-addon" for="birthMonth">Child's Birthday</label>
	  		<select 
	  			id="birthMonth" 
				class="form-control squareBorder"
	  			[formControl]="birthMonth"
	  			(change)="handleChange($event)"
	  		>
	  			<option value="" hidden disabled [selected]="birthMonth.pristine">Month</option>
	  			<option *ngFor="let month of months" [value]="month">{{month}}</option>
	  		</select>
			<input 
				type=text  
				id="birthDate" 
				class="form-control"
				[formControl]="birthDate"
				placeholder="DD"
				(change)="handleChange($event)"
			>
	  		<input 
				type=text
				id="birthYear" 
				class="form-control"  
				[formControl]="birthYear"
				placeholder="YYYY"
				(change)="handleChange($event)"
			>
		</div>

		<div 
			class="form-control-feedback" 
			*ngIf="(birthDate.invalid || birthYear.invalid) && (birthdayGroup.dirty)"
		>
			<p>
				Date must be 2 digits and Year must be 4 digits.
			</p>
		</div>
		<div 
			class="form-control-feedback" 
			*ngIf="bodvalue.invalid && (birthMonth.dirty || birthDate.dirty || birthYear.dirty)"
		>
			<p>
				Birthday fields must be completed.
			</p>
		</div>

	</div>

  `,
  styles: [
  	'select { -webkit-appearance: none; }',
  ],  
})
export class BirthdayDatePickerComponent implements OnInit {
	@Input() bodvalue: FormControl;
	months: Array<string>;
	public birthdayGroup: FormGroup;
	public birthMonth: FormControl;
	public birthDate: FormControl;
	public birthYear: FormControl;

	constructor() { }

	ngOnInit() {
		this.months = [
			'January',
			'Feburary',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		this.birthMonth = new FormControl('',);
		this.birthDate = new FormControl('', [
			Validators.pattern("[0-9]*"),
			Validators.minLength(2), 
			Validators.maxLength(2),
			Validators.min(1),
			Validators.max(31),
		]);
		this.birthYear = new FormControl('', [
			Validators.pattern("[0-9]*"),
			Validators.minLength(4),
			Validators.maxLength(4), 
			Validators.min((new Date().getFullYear()-20)),
			Validators.max(new Date().getFullYear()),
		]);

		this.birthdayGroup = new FormGroup(
			{
		  		birthMonth: this.birthMonth,
		  		birthDate: this.birthDate,
		  		birthYear: this.birthYear,
			}
		);
	}

	handleChange($event) {
		this.bodvalue.setValue(`${this.birthMonth.value}/${this.birthDate.value}/${this.birthYear.value}`);
	}

}

//using formControlName only if the parent has [formGroup]="myGroup" in the template, and myGroup must be a formGroup with the nested controls that contains the formControlName.
