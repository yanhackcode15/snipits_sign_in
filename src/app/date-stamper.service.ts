import { Injectable } from '@angular/core';

@Injectable()
export class DateStamperService {
	private today: any;
	private year: any;
	private month: any;
	private date: any;
	private hour: any;
	private minute: any; 
	private timeStamp: any;
	private dateObj: any;
	private dateStr: any;
	private dateOnly: any;

	constructor() { }

	getDate() { 
	//return a object contain object and a string version of the date 
	// {obj: {year: 1999, month: 01, date: 21, hour: 11, min: 35}, string: '1999-01-21 11:35'}
		let dateMeta = {object: {}, string: '', dateNumber: null };
		this.dateObj = {};

		this.today = new Date(); 
	 	this.year = this.today.getFullYear();
	 	this.month = this.today.getMonth() + 1;
	 	this.date = this.today.getDate();
	 	this.hour = this.today.getHours();
	 	this.minute = this.today.getMinutes();

	 	this.dateObj.year = this.year;
	 	this.dateObj.month = this.month;
	 	this.dateObj.date = this.date;
	 	this.dateObj.hour = this.hour;
	 	this.dateObj.minute = this.minute;

	 	this.dateStr = this.year.toString() + '-' + (this.month.toString().split('').length===1 ? ('0' + this.month.toString()) : (this.month.toString())) + '-' + this.date.toString() + ' ' + this.hour.toString() + ':' + this.minute.toString();

	 	this.dateOnly = this.year.toString() + (this.month.toString().split('').length===1 ? ('0' + this.month.toString()) : (this.month.toString())) + this.date.toString();


	 	dateMeta.object = this.dateObj; 
	 	dateMeta.string = this.dateStr; 
	 	dateMeta.dateNumber = parseInt(this.dateOnly);

	 	return dateMeta; 

	}

 	


}
