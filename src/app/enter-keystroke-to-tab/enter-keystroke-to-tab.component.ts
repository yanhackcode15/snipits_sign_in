import { Component,
		Injectable,
		Inject,
		OnInit, 
		OnDestroy, 
		EventEmitter, 
		Output, 
		Directive, 
		ElementRef, 
		HostListener, 
		Input, 
		Renderer } from '@angular/core';
import {Http, Response} from '@angular/http';

import { RouterModule } from '@angular/router';
import { ActivatedRoute,Params } from '@angular/router';

@Component({
  selector: 'app-enter-keystroke-to-tab',
  templateUrl: './enter-keystroke-to-tab.component.html',
  styleUrls: ['./enter-keystroke-to-tab.component.css']
})


export class EnterKeystrokeToTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
