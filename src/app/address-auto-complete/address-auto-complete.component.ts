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
import { 
	FormControl, 
	FormGroup, 
	Validators, 
	AbstractControl, 
	ValidatorFn,  
} from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-address-auto-complete',
  template: `
	<div 
		class="form-group"
		[formGroup]="parentFormGroup"
		[ngClass]="{
				'text-danger': address.invalid && (address.touched || address.dirty),
				'text-success': address.valid && (address.touched || address.dirty)	
		}"
	>
		<div class="form-group input-group">
			<label class="input-group-addon" for="address">Mailing Address</label>
			<input 
				placeholder="search for location" 
				autocorrect="off" 
				autocapitalize="off" 
				spellcheck="off" 
				type="text" 
				class="form-control" 
				#addressSearchEl 
				id="address" 
				[formControl]="address"
				(change)="showValue($event)"
				(blur)="onBlur($event)"
				autocomplete="random"
				role="presentation"
			>
		</div>
		<div 
			class="form-control-feedback" 
			*ngIf="address.errors && address.touched"
		>
			<p>
				You must select a valid address from the drop down menu.
			</p>
		</div>
	</div>
  `,
})
export class AddressAutoCompleteComponent implements OnInit {
	@Input() parentFormGroup: FormGroup;
	@Output() onSelect: EventEmitter<object> = new EventEmitter<object>();
	private componentForm: object;
	public address: FormControl;
	isVerifiedAddress: boolean = true; 

	@ViewChild("addressSearchEl")
	public addressSearchEl: ElementRef;

	constructor(
		private mapsAPILoader: MapsAPILoader,
    	private ngZone: NgZone
	) { }

	ngOnInit() {

		//create search FormControl
		this.address = new FormControl('', this.mustGoogleVerify.bind(this));

		this.componentForm = {
			street_number: 'short_name', //street number
			route: 'long_name', //street name
			locality: 'long_name', //city
			administrative_area_level_1: 'short_name', //state
			postal_code: 'short_name'
		};

		//load Places Autocomplete
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.addressSearchEl.nativeElement, {
			types: ["address"]
			});
			autocomplete.addListener(
				"place_changed", 
				()=>{	
						this.ngZone.run(() => {
							//get the place result
							let place: google.maps.places.PlaceResult = autocomplete.getPlace();

							//verify result
							if (place.geometry == null) 
							{
								return;
							}

							// const address = Object.assign({}, this.componentForm);
							// for (let key in address) {
							// 	address[key] = ''; 
							// }

							// if (place.address_components) {
							// 	for (var i = 0; i < place.address_components.length; i++) {
						 //          var addressType = place.address_components[i].types[0];
						 //          if (this.componentForm[addressType]) {
						 //            var val = place.address_components[i][this.componentForm[addressType]];
						 //            address[addressType]= val;
						 //          }
						 //        }
							// }
							const address = place.address_components
								.filter((component) => !!this.componentForm[component.types[0]])
								.reduce((address, component) => {
									const addressType = component.types[0];
									address[addressType] = component[this.componentForm[addressType]]
									return address;
								}, {});
							console.log(address);


							this.onSelect.emit(address);
							this.isVerifiedAddress = true;
							this.address.setValue(this.addressSearchEl.nativeElement.value);
							this.parentFormGroup.controls['address'].setValue(this.address.value); 
						});
					}
			);
		});

	}

	onBlur ($event) {
		console.log("Blurrrrred");
	}

	showValue ($e) {
		console.log('showValue', this.address.value);
		if (this.address.value!=='') {
			this.isVerifiedAddress = false;
		}
		else {
			this.isVerifiedAddress = true;	
		}
		this.parentFormGroup.controls['address'].setValidators([this.mustGoogleVerify.bind(this)]);
		this.parentFormGroup.controls['address'].setValue(this.address.value); 
		this.address.updateValueAndValidity();
		// this.notify.emit(this.isVerifiedAddress);	
	}

	mustGoogleVerify (control: AbstractControl): {[key: string]: any} {
	    return this.isVerifiedAddress ? null : {'notVerifiedAddress': {value: control.value}};
	}
}
