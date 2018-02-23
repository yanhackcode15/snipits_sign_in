import {Component, 
		OnInit, 
		ElementRef, 
		TemplateRef,
		NgZone, 
		ViewChild,
		Inject,
} from '@angular/core';
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
		Validators, 
		AbstractControl, 
		ValidatorFn, 
} from "@angular/forms";

import {AddressAutoCompleteComponent} from '../address-auto-complete/address-auto-complete.component';
declare var window: any;

@Component({
	selector: 'app-create-new',
	templateUrl: './create-new.component.html',
	styleUrls: ['./create-new.component.css'],
	providers: [
		DataService, 
		DateStamperService,
		UtilityService,
	],
 	// directives: [AddressAutoCompleteComponent],
})
export class CreateNewComponent implements OnInit {
	@ViewChild('modal') 
	public modal: TemplateRef<any>;

	@ViewChild("lastnameSearchEl")
	public lastnameSearchEl: ElementRef;

	@ViewChild("phoneSearchEl")
	public phoneSearchEl: ElementRef;

	@ViewChild("emailSearchEl")
	public emailSearchEl: ElementRef;

	@ViewChild("childNameSearchEl")
	public childNameSearchEl: ElementRef;

	@ViewChild("addressSearchEl")
	public addressSearchEl: AddressAutoCompleteComponent;

	fieldNames: Array<string>;

	myform2: FormGroup; 

	//existing customer fields
	code: string; 
	lastname: FormControl;
	childCount: FormControl;
	children: FormArray;
	family: any;

	
	email: FormControl;
	mailingAddr: any;
	address: FormControl;
	phone: FormControl;
	leadSource: FormControl;
	leadKeys: Array<string>; 
	leadMap: any;
	noSubmit: any;
	isVerifiedAddress: boolean; 
	error: boolean; 
	dateTime: object;

	constructor(private dataService: DataService, private router:Router, private dateStamperService: DateStamperService, private utilityService: UtilityService) {
		this.leadMap = {
			'Not sure': '0000',
            'Yelp': '1185',
            'Google': '1139', 
            'Drive walk by': '1130',
            'Friends Family Referral': '1134',
            'Grapevine': '1132', 
            'Facebook Page or Ad': '1141', 
            'Attended Snip-its B-Day Party': '1135',
            'Coupon in mail': '1133',  
            'Magazine ad': '1129', 
            'Other business': '0001',
            'Other': '0000',
		};
		this.family = {
				code: '',
				lastname: '',
				phone: '',
				streetAddress: '',
				city: '',
				state: '',
				zip: '',
				children: [],
				leadSource: {},
		};

		this.mailingAddr = {};

		this.leadKeys = Object.keys(this.leadMap);
		this.error = false;
		this.fieldNames = ['lastname', 'phone', 'email', 'address', 'children'];
	}

	updateCount() {

		if (this.childCount.value > this.children.controls.length) {
			
			for (let i = this.children.controls.length || 0; i < this.childCount.value; ++i) {
				this.children.push(new FormGroup({
					childName: new FormControl('', Validators.required),
					childGender: new FormControl('',),
					// childBirthday: new FormControl('',),
					childBirthdate: new FormControl('', this.allOrNothing.bind(this)),
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
		// this.dataService.getChild();
		this.createFormControls();
		this.createForm();
		this.initializeSubmitFields ();
	}

	createFormControls() {
	    this.lastname = new FormControl('', Validators.required);
	    this.childCount = new FormControl('1', Validators.required);

	    this.children = new FormArray([new FormGroup({
	    	childName: new FormControl('', Validators.required),
	    	childGender: new FormControl('',),
	    	// childBirthday: new FormControl('',),
	    	childBirthdate: new FormControl('', this.allOrNothing.bind(this))
	    })]);
	    this.email = new FormControl('', [
	    	Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	    ]) ;
	    this.address = new FormControl();
	    this.phone = new FormControl('', [
	    	Validators.required,
	    	Validators.pattern("[0-9]*"),
	    	Validators.minLength(10), 
	    	Validators.maxLength(10)
	    ]); 
	    this.leadSource = new FormControl('', []);

	}

	createForm() {
		this.myform2 = new FormGroup({
	        lastname: this.lastname, 
	        childCount: this.childCount,
	        children: this.children,
	        phone: this.phone,
	        email: this.email,
	        address: this.address,
	        leadSource: this.leadSource,
	    });

	}

	signIn() {
		console.log('children valid', this.children.valid);
		this.lastname.markAsTouched();
		this.phone.markAsTouched(); 
		this.children.controls.forEach((childGroup)=>{
			childGroup.get('childName').markAsTouched();
		}); 

		let children: any = [];
		let paramsObj:any  = {};
		let leadCode: any = this.leadMap[this.leadSource.value || 'Not sure'];
		let length: any = this.phone.value.length;
		let fcode: any = this.phone.value.slice(length-4, length);

		if (this.myform2.valid) {
			this.children.controls.forEach((childGroup)=>{
				children.push({
					childName: childGroup.get('childName').value,
					childGender: childGroup.get('childGender').value,
					childBirthdate: childGroup.get('childBirthdate').value,
					status: 0,
				});
			});

			this.family.code = fcode;
			this.family.lastname = this.lastname.value;
			this.family.phone = this.phone.value;
			this.family.email = this.email.value;
			if (Object.keys(this.mailingAddr).length!=0) {
				this.family.streetAddress = this.mailingAddr.street_number + ' ' + this.mailingAddr.route;
				this.family.city = this.mailingAddr.locality;
				this.family.state = this.mailingAddr.administrative_area_level_1;
				this.family.zip = this.mailingAddr.postal_code;
			}

			this.family.children = children;
			this.family.leadSource = {leadCode: leadCode, leadSource: this.leadSource.value};
			this.family.dateTime = this.dateStamperService.getDate();

			//construct an object to pass as the confirmation page url params
			paramsObj.code = fcode; 
			paramsObj.lastname = this.family.lastname; 
			paramsObj.children = this.family.children.map(child => child.childName).join(',');
			paramsObj.timeStamp = this.family.dateTime.string; 
			

			this.dataService.signInFamily(this.family)
				// .then(() => this.router.navigateByUrl(urlString);
				// .then( ()=>this.router.navigate(['confirmation', paramsObj]))
				.then( ()=>this.router.navigate(['confirmation'], {queryParams: paramsObj} ) )
		}
		else {
			this.error = true; 
			this.checkValid();
			this.noSubmit = "Please make sure to fill in all required fields and check for errors.";
		}
	}

	handleAddressSelect(address:object):void {
		this.mailingAddr = address; 
	}

	closeAlert() {
		this.error = false;
	}

	checkValid() {
		for (let i=0; i<this.fieldNames.length; i++) {
			const control = this.myform2.get(this.fieldNames[i]); 
			if (control.invalid===true) {
				switch (this.fieldNames[i]) {
		   			case 'lastname':
		   				this.lastnameSearchEl.nativeElement.scrollIntoView();
			   			break;
			   		case 'phone':
			   			this.phoneSearchEl.nativeElement.scrollIntoView();
			   			break;
			   		case 'email':
			   			this.emailSearchEl.nativeElement.scrollIntoView();
			   			break;
			   		case 'address':
			   			this.addressSearchEl.addressSearchEl.nativeElement.scrollIntoView();
			   			break;
			   		case 'children': 
			   			this.childNameSearchEl.nativeElement.scrollIntoView();
			   			break;
			   }
			   window.scrollBy(0, -66); // Leave space for the error message
			   return; 
			}
		}
	}

	initializeSubmitFields () {
		this.family.code = '';
		this.family.lastname = '';
		this.family.phone = '';
		this.family.email = '';
		this.family.streetAddress = '';
		this.family.city = '';
		this.family.state = '';
		this.family.zip = '';
		this.family.leadSource = '';
		this.family.children= [{
			childName: '',
			childGender: '',
			childBirthdate: '//',
		}];
		this.family.dateTime = {}; 
	}

	allOrNothing (control: AbstractControl): {[key: string]: any} {
	  	let valid = true;
	  	let birthArry = control.value.split('/');
	  	console.log('birthArry', birthArry);

		if (birthArry[0] !== '' && birthArry[0] !== 'Month' && (birthArry[1] !== '') && (birthArry[2] !== '')) {
			valid = true;
			console.log('if', valid);
		}
		else if ((birthArry[0] === '') && (birthArry[1] === '') && (birthArry[2]=== '')) { //all must be empty
			valid = true;
			console.log('else if', valid);
		}
		else if (birthArry.length===1) {
			valid = true;
			console.log('else if', valid);
		}
		else { 
			valid = false;
			console.log('else', valid);
		}
	
		return valid ? null : {'notValidBirthday': {value: control.value}};
	}

	onKeydown(e) {
		this.utilityService.onKeydown(e);		
	}

	



	// onNotify(addr:object):void {
 //    	// alert(addr);
 //    	this.mailingAddr = addr;
 //    	console.log('notified add', this.mailingAddr); 

 // 	}

	// onNotify(flag:boolean):void {
 //    	this.isVerifiedAddress = flag;
 //    	console.log('this.isVerifiedAddress', this.isVerifiedAddress);
 // 	}

 //remaining: this.address formcontrol isn't surfacing from the child component. it's declared in both sub and parent comp. not sure if that's necessary. imagine the child comp should be able to 

}
