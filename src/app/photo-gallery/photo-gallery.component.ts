import { Component, OnInit } from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition,
	keyframes,
} from '@angular/animations';

@Component({
	selector: 'app-photo-gallery',
	templateUrl: './photo-gallery.component.html',
	styleUrls: ['./photo-gallery.component.css'],
	animations: [
		trigger('photoState', [
			state('move', style({
				transform: 'translateX(-100%) translateY(50px)',
			})),
			state('enlarge', style({
				transform: 'scale(1.2)',
			})),
			state('spin', style({
				transform: 'rotateY(180deg) rotateZ(90deg)',
			})),
			state('default', style({})),
			// transition('* => *', animate('5000ms ease'))
			transition(
				'* => *', 
				animate('5000ms', 
					keyframes([
						style({transform: 'translateX(0) rotateY(0)', offset: 0}),
						style({transform: 'translateX(50%) rotateY(90deg)', offset: 0.33}),
						style({transform: 'translateX(-75%) rotateY(180deg)', offset: 0.66}),
						style({transform: 'translateX(+75%) rotateY(80deg)', offset: 1})
					])
				)
			)

		])

	]
})
export class PhotoGalleryComponent implements OnInit {
	position: string='default'; 
	photoUrl = 'https://images.pexels.com/photos/753037/pexels-photo-753037.jpeg?h=350&w=525&dpr=2&auto=compress&cs=tinysrgb';

	constructor() { }

	ngOnInit() {
	}

	changePosition(newPosition: string) {
		this.position = newPosition; 
	}

}
