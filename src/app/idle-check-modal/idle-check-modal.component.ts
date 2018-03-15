import { 
	Component, 
	OnInit, 
	ViewChild, 
	TemplateRef, 
	AfterViewInit, 
	ChangeDetectorRef, 
	EventEmitter, 
	Output
} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Router, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

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
				<button type="button" class="btn btn-lg btn-outline-primary" (click)="routeToHome()">Back to Home</button>
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
	timerId: any;
	modalTimer: any=50000;
	toHomeTimer: any=10000;

	@Output() openFlag = new EventEmitter<boolean>();

	constructor( private modalService: NgbModal, private router: Router, private cd: ChangeDetectorRef ) { }

	ngAfterViewInit() {
    	this.resetIdle();
  	}

	ngOnInit() {
	  	this.router.events
	  		.filter((event) => event instanceof NavigationEnd)
	  		.subscribe((event) => {
    			this.clearAll();
	  		});
	}

	open(content) {
		if (document.activeElement instanceof HTMLElement) {
			const eleRef = document.activeElement as HTMLElement;
			eleRef.blur();
		}
		this.modalReference = this.modalService.open(content);
		this.resetRouteToHome() 

		this.modalReference.result.then(() => this.resetIdle(), () => this.resetIdle());
	}

	closeModal(){
		this.modalReference.close();
	}

	resetIdle() {
		clearTimeout(this.timerId);
		this.timerId = setTimeout(() => {
	        this.open(this.content);
	    }, this.modalTimer);  
	}

	resetRouteToHome() {
		clearTimeout(this.timerId);
		this.timerId = setTimeout(() => {
	        this.routeToHome();
	    }, this.toHomeTimer);  
	}

	routeToHome() {
		clearTimeout(this.timerId);
		this.router.navigate(['']);
	}

	clearAll() {
		clearTimeout(this.timerId);
		if (this.modalReference) {
			this.modalReference.close();
			// Modal close is async and triggers `resetIdle()`
			// so we need to clear the timer after it sets it
			setTimeout(() => clearTimeout(this.timerId));
		}
		
	}
}
