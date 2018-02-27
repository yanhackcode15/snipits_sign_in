import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'childCheckInFilter'
})
export class ChildCheckInFilterPipe implements PipeTransform {

  transform(children: any): any {
  	// if (child.childCheckIn===undefined) return children; //if checkInFlag doesn't exist as in the case of returning families who don't need to explicitly specify the flag
  	return children.filter((child)=>{
  		return ( (child.childCheckIn===undefined || child.childCheckIn==='true') ? true : false);
  	})
  }

}
