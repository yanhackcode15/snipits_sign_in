import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';


@Component({
	selector: 'app-idle-check-modal',
	template: `
		<ng-template #content let-c="close" let-d="dismiss">
			<div class="modal-header">
		    	<h4 class="modal-title">You still there?</h4>
		    	<button type="button" class="close" aria-label="Close" (click)="closeModal()">
		      		<span aria-hidden="true">&times;</span>
		    	</button>
			</div>
			<div class="modal-body">
		    	<p>It looks like you haven't been active&hellip;Do you need more time? </p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-lg btn-outline-primary" (click)="routeToHome($event)">Back to Home</button>
		    	<button type="button" class="btn btn-lg btn-primary" (click)="closeModal()">More Time</button>
			</div>

		</ng-template>
	`,
	styleUrls: ['./idle-check-modal.component.css']
})

export class IdleCheckModalComponent implements OnInit {

	@ViewChild('content') content: TemplateRef<any>;
	closeResult: string;
	modalReference: any;
	modalTimerId: any;
	toHomeTimerId: any;
	modalTimer: any=50000;
	toHomeTimer: any=10000;
	constructor( private modalService: NgbModal, private router: Router, ) { }

	ngAfterViewInit() {
    	this.modalTimerId = setTimeout(() => {
	        this.open(this.content);
	    }, this.modalTimer);  //5s
  	}

	ngOnInit() {
	}

	open(content) {
		console.log('I was opened')
		this.modalReference = this.modalService.open(content);
		this.toHomeTimerId = setTimeout(() => {
	        this.routeToHome(null);
	    }, this.toHomeTimer); 
		this.modalReference.result.then((result) => {
			// this.closeResult = `Closed with: ${result}`;
			//this call back is called when a modal is closed
			clearTimeout(this.toHomeTimerId);
			
		}, (reason) => {
			//this callback is called when the modal is dismissed
			// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			this.cancelIdle(null);
			clearTimeout(this.toHomeTimerId);
		});
	}

	closeModal(){
		this.modalReference.close();
		this.cancelIdle(null);

	}
	cancelIdle($e) {
		clearTimeout(this.modalTimerId);
		this.modalTimerId = setTimeout(() => {
	        this.open(this.content);
	    }, this.modalTimer);  
	}

	routeToHome($e) {
		clearTimeout(this.modalTimerId);
		this.modalReference.close();
		this.router.navigate(['']);

	}

	// private getDismissReason(reason: any): string {
	// 	if (reason === ModalDismissReasons.ESC) {
	// 		return 'by pressing ESC';
	// 	} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	// 		return 'by clicking on a backdrop';
	// 	} else {
	// 		return  `with: ${reason}`;
	// 	}
	// }


}
