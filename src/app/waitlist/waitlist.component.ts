import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {ReactiveFormsModule, 
		FormsModule, 
		FormBuilder, 
		FormControl, 
		FormArray,
		FormGroup, 
		Validators, 
} from "@angular/forms";

@Component({
	selector: 'app-waitlist',
	templateUrl: './waitlist.component.html',
	styleUrls: ['./waitlist.component.css'],
	providers: [
		DataService,
	],
})
export class WaitlistComponent implements OnInit {
	status: boolean; 
	families: any[]=[];
	todayChildren: any; //a db reference/object, can call it with .once method
	waitlistNotesForm: FormGroup;
	// familyNotes: FormControl;
	familyControlArry: FormArray;
	initialDataLoad: boolean = false; 

	constructor(private dataService: DataService) { }

	ngOnInit() {
		//create form controls and create the form
		this.createFormControls();
		this.createForm();
		//load from db to the families array containing {key: familyKey, data: familyData}, the families array mimic the structure in firebase
		this.todayChildren = this.dataService.getTodaysChildren();
		this.todayChildren.on('child_added', (familySnapshot)=> {
			if (this.initialDataLoad) {
				var familyKey = familySnapshot.key;
				var familyData = familySnapshot.val();
				this.families.push({key: familyKey, data: familyData});
				this.familyControlArry.push(new FormGroup({
					familyNotes: new FormControl('',),
				}));
				let l = this.familyControlArry.controls.length;
				this.familyControlArry.at(l-1).get('familyNotes').valueChanges.subscribe((note)=>{
					this.families[l-1].data.note = note;
					console.log('each form control content', note);
					console.log('each form control index', l-1);
				});

			}
		});
		
		this.todayChildren.once('value', (snapshot)=>{ 
			snapshot.forEach((eachShot)=>{
				var familyKey = eachShot.key;
				var familyData = eachShot.val();
				this.families.push({key: familyKey, data: familyData});
				this.familyControlArry.push(new FormGroup({
					familyNotes: new FormControl('',),
				}));
				let l = this.familyControlArry.controls.length;
				this.familyControlArry.at(l-1).get('familyNotes').valueChanges.subscribe((note)=>{
					this.families[l-1].data.note = note;
					console.log('each form control content', note);
					console.log('each form control index', l-1);
				});
			});

			this.initialDataLoad = true;
		});
	}

	checkInChild($e, f, i, c, j) {

		this.families[i].data.children[j].status = !this.families[i].data.children[j].status;
		//set a flag on the child
		this.dataService.toggleChildStatus(f.data, j)
			.then(()=>{
				this.todayChildren.once('value', (snapshot)=>{
					snapshot.forEach((familySnapshot)=> {
						if (familySnapshot.key===f.key){
							//compare the status boolean with the db status, if matching, verify status update successful; if not matching, show not successful

							if (this.families[i].data.children[j].status == familySnapshot.val().children[j].status) {
								this.families[i].data.children[j].sync = true; //set the sync flag to be true for the child when the object status matches what came back from the db,
							}
							else {
								this.families[i].data.children[j].sync = false; //set the sync flag to false otherwise, 
								// console.log('not sync');
							}
						}
						
					});
				});
			});

	}

	//implement a mechanism to save the note field content to a local model and upon 'save' click to save to firebase

	createFormControls() {
		this.familyControlArry = new FormArray([]);
	}

	createForm() {
		this.waitlistNotesForm = new FormGroup({
	        familyControlArry: this.familyControlArry,
	    });

	}

	submitNotes(key, index) {
		let content = this.families[index].data.note;
		this.dataService.updateFamilyNotes(key, content);
	}



	// convert from real time submit to optimistic 
	// when clicked, view immediately refelect user's intention; component will insert the db update into a promise array to execute; 
	//add a symbol to indicate whether the db update has issues or not

}
