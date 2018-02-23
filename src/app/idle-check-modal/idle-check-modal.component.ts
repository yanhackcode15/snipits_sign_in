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
	id: any;
	constructor( private modalService: NgbModal, private router: Router, ) { }

	ngAfterViewInit() {
    	this.id = setTimeout(() => {
	        this.open(this.content);
	    }, 10000);  //5s
  	}

	ngOnInit() {
	}

	open(content) {
		this.modalReference = this.modalService.open(content);
		this.modalReference.result.then((result) => {
			// this.closeResult = `Closed with: ${result}`;
			
		}, (reason) => {
			// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			this.cancelIdle(null);
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

	closeModal(){
		this.modalReference.close();
		this.cancelIdle(null);

	}
	cancelIdle($e) {
		clearTimeout(this.id);
		this.id = setTimeout(() => {
	        this.open(this.content);
	    }, 10000);  
	}

	routeToHome($e) {
		clearTimeout(this.id);
		this.modalReference.close();
		this.router.navigate(['']);

	}


}
