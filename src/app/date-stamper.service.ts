import { Injectable } from '@angular/core';

@Injectable()
export class DateStamperService {
	constructor() { }

	public getToday() {
		let today = new Date(); //instantiate today object
		let year = today.getFullYear();  //no padding required
	 	let month = this.padSingleDigit(today.getMonth() + 1); //month starts from 0 and needs to always be padded two 2 digits;
	 	let date = this.padSingleDigit(today.getDate()); //padded to 2 digits
	 	let hour = this.padSingleDigit(today.getHours()); //padded to 2 dig
	 	let minute = this.padSingleDigit(today.getMinutes()); //padded to 2 digits
	 	return this.createDate(year, month, date, hour, minute);
	}

	private createDate(y, mth, d, h, min) { //create a date object from a set of inidividual components with keys representing date in various forms: object, string and just date in number form
		let date = {
			dateObj: this.getObj(y, mth, d, h, min), //object
			dateString: this.getFullStr(y, mth, d, h, min), // data type: string
			dateNumber: this.getNum(y, mth, d), // date type: num
			};
		return date; 
	}

	private getObj(y, mth, d, h, min) {
		let obj = {
			year: y,
			month: mth,
			date: d,
			hour: h,
			minute: min,
		};
		return obj;
	}

	private getFullStr(y, mth, d, h, min) {
		let str = y.toString() + '-' + mth.toString() + '-' + d.toString() + ' ' + h.toString() + ':' + min.toString();
		return str;
	}

	private getNum(y, mth, d) {
		let dateInNum = parseInt(y.toString() + mth.toString() + d.toString());
		return dateInNum;
	}

	private padSingleDigit(int) { //pad single digit date or month to two digits
		let str = int.toString();
		let length = str.split('').length;
		return (length===1 ? ('0' + str): (str));
	}

}
