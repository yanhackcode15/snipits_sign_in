import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {CreateNewComponent} from './create-new/create-new.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {WaitlistComponent} from './waitlist/waitlist.component';
import {PopOverComponent} from './pop-over/pop-over.component';
import {PhotoGalleryComponent} from './photo-gallery/photo-gallery.component';


const routes: Routes = [
	{
		path: '', 
		component: LandingPageComponent,
	},
	{
		path: 'create-new', 
		component: CreateNewComponent,
	},
	{
		path: 'sign-in', 
		component: SignInComponent,
	},
	{
		path: 'confirmation', 
		component: ConfirmationComponent,
	},
	{
		path: 'waitlist',
		component: WaitlistComponent,
	},
	{
		path: 'pop-over',
		component: PopOverComponent,
	},
	{
		path: 'photo-gallery',
		component: PhotoGalleryComponent,
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
