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
	families: any[]=[]
	;
	waitingCount: any = 0;

	constructor(private dataService: DataService, private activeroute: ActivatedRoute, private router: Router) { 
		this.activeroute.queryParams.subscribe( params => {
			this.lastname = params.lastname;
			this.fcode = params.code;
			this.children = params.children.split(',');
			this.timeStamp = params.timeStamp;
			this.waitingCount = parseInt(params.waitingCount) + 1;
		});
	}

	ngOnInit() {
		setTimeout(() => {
	        this.router.navigate(['']);
	    }, 10*1000);  
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

}
