// Angular
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
	selector: 'kt-fetch-entity-dialog',
	templateUrl: './fetch-entity-dialog.component.html'
})
export class FetchEntityDialogComponent {
/**
	 * Component constructor
	 *
	 * @param data: any
	 */
 constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

 /**
  * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
  */

 /**
  * On init
  */
 ngOnInit() {
	 if (!this.data.showUndoButton || (this.data.undoButtonDuration >= this.data.duration)) {
		 return;
	 }

	 this.delayForUndoButton(this.data.undoButtonDuration).subscribe(() => {
		 this.data.showUndoButton = false;
	 });
 }

 /*
  *	Returns delay
  *
  * @param timeToDelay: any
  */
 delayForUndoButton(timeToDelay) {
	 return of('').pipe(delay(timeToDelay));
 }

 /**
  * Dismiss with Action
  */
 onDismissWithAction() {
	 this.data.snackBar.dismiss();
 }

 /**
  * Dismiss
  */
   public onDismiss() {
	 this.data.snackBar.dismiss();
 }
}
