import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';
import {DataService} from '../data.service';


@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.css'], 
	providers: [
		DataService,
	],
})
export class ConfirmationComponent implements OnInit {
	lastname: string; 
	fcode: string;
	children: Array<string> = [];
	timeStamp: string;
	families: any[]=[];
	waitingCount: any = 0;

	constructor(private dataService: DataService, private activeroute: ActivatedRoute, private router: Router) { 
		this.activeroute.queryParams.subscribe( params => {
			this.lastname = params.lastname;
			this.fcode = params.code;
			this.children = params.children.split(',');
			this.timeStamp = params.timeStamp;
		});
	}

	ngOnInit() {

		setTimeout(() => {
	        this.router.navigate(['']);
	    }, 10000);  //5s

		this.getWaitingCount();
	}

	capitalizeFirst(str) {
		return str.split('').map(function(letter,index){
		    if(index == 0){
		      return letter.toUpperCase();
		    }
		    else {
		    	return letter;
		    }
		}).join('');
	}

	getWaitingCount() {
		let count
		this.dataService.getTodaysChildren().once('value', (snapshot)=>{ 
			snapshot.forEach((eachShot)=>{
				var familyData = eachShot.val();
				this.families.push(familyData);
			});
		});

		this.families.forEach((family)=>{
			family.children.forEach((child)=>{
				if (child.status===0 && (!child.childCheckIn || child.childCheckIn ==='true'  )) {this.waitingCount++}
			});

		});
	}




}
