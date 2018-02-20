import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import { DateStamperService } from '../date-stamper.service';
import {UtilityService} from '../utility.service';

import {Router} from '@angular/router';
import {ReactiveFormsModule, 
		FormsModule, 
		FormBuilder, 
		FormControl, 
		FormGroup, 
		FormArray,
		Validators
} from "@angular/forms";


@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css'],
	providers: [
		DataService,
		DateStamperService,
		UtilityService,
	],
})

export class SignInComponent implements OnInit {
	myform: FormGroup; 
	code: FormControl; 
	lastname: FormControl;
	childCount: FormControl;
	children: FormArray;
	family: any;
	noSubmit: any;

	constructor(private dataService: DataService, private router: Router, private dateStamperService: DateStamperService, private utilityService: UtilityService,) {
		
	}

	updateCount() {

		if (this.childCount.value > this.children.controls.length) {
			for (let i = this.children.controls.length; i < this.childCount.value; ++i) {
				this.children.push(new FormGroup({
					childName: new FormControl('', Validators.required)
				}));
			}
		}
		else {
			for (let i = this.children.controls.length; i > this.childCount.value; i--) {
				this.children.removeAt(i-1);
			}
		}

	}

	ngOnInit() {
		// this.dataService.fetchData().subscribe(); //what does this do?
		this.dataService.getChild();

		this.createFormControls();
    	this.createForm();
	}

	createFormControls() {
	    this.code = new FormControl('', [
	    	Validators.required, 
	    	Validators.pattern("[0-9]*"),
	    	Validators.minLength(4), 
	    	Validators.maxLength(4)
	    ]);
	    this.lastname = new FormControl('', Validators.required);
	    this.childCount = new FormControl('1', Validators.required);
	    this.children = new FormArray([new FormGroup({
	    	childName: new FormControl('', Validators.required)
	    })]);
	}

	createForm() {
	    this.myform = new FormGroup({
	        code: this.code,
	        lastname: this.lastname, 
	        childCount: this.childCount,
	        children: this.children,
	    });
	}

	signIn() {
		let children: any = [];
		let paramsObj: any = {};

		if (this.myform.valid) {
			this.children.controls.forEach((childGroup)=>{
				children.push({
					childName: childGroup.get('childName').value,
					status: 0,
				});
			});

			this.family = {
				code: this.code.value,
				lastname: this.lastname.value,
				children: children,
			};

			this.family.dateTime = this.dateStamperService.getDate();
			
			//construct an object to pass as the confirmation page url params
			paramsObj.code = this.family.code; 
			paramsObj.lastname = this.family.lastname; 
			paramsObj.children = this.family.children.map(child => child.childName).join(',');
			paramsObj.timeStamp = this.family.dateTime.string;


			this.dataService.signInFamily(this.family)
				// .then(() => this.router.navigateByUrl(urlString);
				// .then( ()=>this.router.navigate(['confirmation', paramsObj]))
				.then( ()=>this.router.navigate(['confirmation'], {queryParams: paramsObj} ) )
		}
		else {
			this.noSubmit = "Please make sure to fill in all required fields and check for errors.";
		}
		

	}

	onKeydown(e) {
		this.utilityService.onKeydown(e);
	}

}

