import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';

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

	constructor(private dataService: DataService) { }

	ngOnInit() {
		//load from db to the families array containing {key: familyKey, data: familyData}, the families array mimic the structure in firebase
		this.todayChildren = this.dataService.getTodaysChildren();
		this.todayChildren.once('value', (snapshot)=> {
			snapshot.forEach((familySnapshot)=> {
				var familyKey = familySnapshot.key;
				// console.log('familyKey', familyKey);
				var familyData = familySnapshot.val();
				this.families.push({key: familyKey, data: familyData});
			});
			// console.log('children', this.families);
			
		});
	}

	checkInChild($e, f, i, c, j) {

		this.families[i].data.children[j].status = !this.families[i].data.children[j].status;
		//set a flag on the child
		this.dataService.toggleChildStatus(f.data, j)
			.then(()=>{
				this.todayChildren.once('value', (snapshot)=>{
					// console.log('snapshot',snapshot.val());
					snapshot.forEach((familySnapshot)=> {
						if (familySnapshot.key===f.key){
							//compare the status boolean with the db status, if matching, verify status update successful; if not matching, show not successful

							if (this.families[i].data.children[j].status == familySnapshot.val().children[j].status) {
								this.families[i].data.children[j].sync = true; //set the sync flag to be true for the child when the object status matches what came back from the db,
							}
							else {
								this.families[i].data.children[j].sync = false; //set the sync flag to false otherwise, 
								console.log('not sync');
							}
						}
						
					});
				});
			});

	}

	// convert from real time submit to optimistic 
	// when clicked, view immediately refelect user's intention; component will insert the db update into a promise array to execute; 
	//add a symbol to indicate whether the db update has issues or not

}
