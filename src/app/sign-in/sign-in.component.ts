import { Component, OnInit, ViewChild } from '@angular/core';
import {DataService} from '../data.service';
import { DateStamperService } from '../date-stamper.service';
import {UtilityService} from '../utility.service';
import {IdleCheckModalComponent} from '../idle-check-modal/idle-check-modal.component';

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
	formSubmit: boolean = false; 
	noSubmit: any;
	error: boolean;
	waitingCount: any = 0;

	@ViewChild(IdleCheckModalComponent) modal: IdleCheckModalComponent;

	constructor(private dataService: DataService, private router: Router, private dateStamperService: DateStamperService, private utilityService: UtilityService,) {
		
	}

	updateCount() {

		if (this.childCount.value > this.children.controls.length) {
			for (let i = this.children.controls.length; i < this.childCount.value; ++i) {
				this.children.push(new FormGroup({
					childName: new FormControl('', Validators.required),
					childGender: new FormControl('', Validators.required),
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
	    	childName: new FormControl('', Validators.required),
	    	childGender: new FormControl('', Validators.required),
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
			this.error = false;
			this.modal.clearAll();
			//construct an object to pass as the confirmation page url params
			this.children.controls.forEach((childGroup)=>{
				children.push({
					childName: childGroup.get('childName').value,
					status: 0,
					gender: childGroup.get('childGender').value,
				});
			});

			this.family = {
				code: this.code.value,
				lastname: this.lastname.value,
				children: children,
				newCustomer: 'N',
				notes: '',
			};

			this.family.dateTime = this.dateStamperService.getToday();
			this.dataService.getWaitingCount()
			.then((count)=>{
				paramsObj.code = this.family.code; 
				paramsObj.lastname = this.family.lastname; 
				paramsObj.children = this.family.children.map(child => child.childName).join(',');
				paramsObj.timeStamp = this.family.dateTime.dateString;
				paramsObj.waitingCount = count;

				this.dataService.signInFamily(this.family)
					.then( ()=>this.router.navigate(['confirmation'], {queryParams: paramsObj} ) )
			});
		}
		else {
			this.error = true; 
			this.noSubmit = "Please make sure to fill in all required fields and check for errors.";
		}

	}

	closeAlert() {
		this.error = false;
	}

	onKeydown(e) {
		this.utilityService.onKeydown(e);
	}

	getWaitingCount = ()=>{
		return new Promise ( (resolve, reject) =>{
			let count=0;
			let waitingFamilies=[];
			this.dataService.getTodaysChildren().once('value', (snapshot)=>{ 
				snapshot.forEach(eachShot=>{
					waitingFamilies.push(eachShot.val());
				});
				waitingFamilies.forEach((family)=>{
					family.children.forEach((child)=>{
						if (child.status===0 && (!child.childCheckIn || child.childCheckIn ==='true'  )) {count++}
					});

				});
				resolve(count);
			});
		});
	}
}

