import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { FormsModule } from '@angular/forms';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormControl,
    Validators,
    FormBuilder,
    FormArray
} from '@angular/forms';

import {HttpClientModule} from '@angular/common/http';
// import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { AgmCoreModule } from '@agm/core';
import {TouchEventModule} from "ng2-events/lib/touch";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CreateNewComponent } from './create-new/create-new.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import {DataService} from './data.service';
import {UtilityService} from './utility.service';
import { DateStamperService } from './date-stamper.service';

import { PopOverComponent } from './pop-over/pop-over.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { AddressAutoCompleteComponent } from './address-auto-complete/address-auto-complete.component';
import { BirthdayDatePickerComponent } from './birthday-date-picker/birthday-date-picker.component';
import { WaitlistComponent } from './waitlist/waitlist.component';
import { IdleCheckModalComponent } from './idle-check-modal/idle-check-modal.component';
import { ChildCheckInFilterPipe } from './child-check-in-filter.pipe';




@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    CreateNewComponent,
    SignInComponent,
    ConfirmationComponent,
    PopOverComponent,
    PhotoGalleryComponent,
    AddressAutoCompleteComponent,
    BirthdayDatePickerComponent,
    WaitlistComponent,
    IdleCheckModalComponent,
    ChildCheckInFilterPipe,
  ],
  imports: [
    AgmCoreModule.forRoot({
        apiKey: "AIzaSyD6WD0zAREsszfAfNgt8E1NN_x1CvQsq5Q",
        libraries: ["places"]
    }),
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TouchEventModule,
    // FormArray,
    // NgBootstrapFormValidationModule.forRoot(),
  ],
  providers: [DataService, DateStamperService, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
