import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
	lastname: string; 
	fcode: string;
	children: Array<string> = [];
	timeStamp: string;

	constructor(private activeroute: ActivatedRoute, private router: Router) { 
		this.activeroute.queryParams.subscribe( params => {
			this.lastname = params.lastname;
			this.fcode = params.code;
			this.children = params.children.split(',');
			this.timeStamp = params.timeStamp;
		})
	}

	ngOnInit() {

		setTimeout(() => {
	        this.router.navigate(['']);
	    }, 10000);  //5s
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
