import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DateStamperService } from './date-stamper.service';

declare var firebase: any; //declare firebase API hookup


@Injectable()
export class DataService {
	today: any; 

	constructor(private http: HttpClient, private dateStamperService: DateStamperService) { }

	// fetchData() {
	// 	return this.http.get('https://snipits-sign-in.firebaseio.com/.json');
	// }

	getChild() {
		firebase.database().ref('/families').on('child_added', (snapshot)=>{
			// console.log(snapshot.val())
		});
	}

	signInFamily(familyObj) {
		return firebase.database().ref('/families').push(familyObj);
		// this.getChild();
	}

	getTodaysChildren () {
		this.today = this.dateStamperService.getToday().dateNumber; //20180117 as a number
		console.log(this.today);
		return firebase.database().ref('/families').orderByChild('dateTime/dateNumber').startAt(this.today);
	}

	toggleChildStatus(family, cindex) {
		return firebase.database().ref('/families').orderByChild('dateTime/dateNumber').equalTo(family.dateTime.dateNumber).once('value')
			.then ( (snapshot)=> {
				console.log('snapshot', snapshot);
			snapshot.forEach((familySnapshot)=> {
				console.log('familySnapshot', familySnapshot);
				var familyKey = familySnapshot.key;
				var familyData = familySnapshot.val();

				if (familyData.dateTime.string===family.dateTime.string && familyData.lastname===family.lastname) {
					console.log('status',familyData.children[cindex].status)

					let status = familyData.children[cindex].status;
					let update = {};
					update['children/' + cindex + '/status/'] = status ? 0 : 1;
					return firebase.database().ref('/families/' + familyKey).update(update);

				}
			});
		});
	}

	updateFamilyNotes(key, content) {
		let newNotes = {};
		newNotes[key+'/notes'] = content;
		return firebase.database().ref('/families').update(newNotes);
	}

	getWaitingCount = ()=>{
		return new Promise ( (resolve, reject)=>{
			let count=0;
			let waitingFamilies=[];
			this.getTodaysChildren().once('value', (snapshot)=>{ 
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
