import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

	constructor() { }
	onKeydown(e) {
		let control:any;
		control = this.nextFormField(e.target);
		if (control) { //if next element returns true -- the current form element isn't the last one, move cursor to the next one
			e.preventDefault();
			control.focus();
			return; 
		}
		return; 
		// the current form element is the last one on the page -->don't alter the state of the keydown, so by default, it'll submit the form
	}

	nextFormField(c) { //resursively find the next leaf node that's a form field;
		let n: any;
		let length: any;
		let formField: any;

		n = c.nextElementSibling; 
		console.log('c', c);
		console.log('n',n);

		if (n) {
			while (n.hasChildNodes()) {
				n = n.childNodes[0];	
			}
			formField = this.formFieldNode(n);
			
			if (formField){
				console.log('formField', formField);
				return formField; 
			}
			else {
				return this.nextFormField(n);
			}
		}
		else {
			if (c.parentNode.nodeName=='BODY') {
				return false;
			}
			else {
				return this.nextFormField(c.parentNode);
			}
		}
	}

	formFieldNode (c) { //return the DOM element if it's form field; otherwise, return false;
		if ((!c.hidden) && 
				(c.nodeName == 'INPUT' || 
		 	c.nodeName == 'SELECT' || 
		 	c.nodeName == 'BUTTON' || 
		 	c.nodeName == 'TEXTAREA')) 
		{
			return c;	
		}
		else {
			return false;
		} 
	}

}
