// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'kt-update-status-dialog',
	templateUrl: './update-status-dialog.component.html'
})
export class UpdateStatusDialogComponent implements OnInit {
	viewLoading: boolean = false;
	//yesText: string = 'Delete';
	constructor(
		public dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
		//if (this.data.doPositiveBtn)
			//this.yesText = this.data.doPositiveBtn;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onYesClick(): void {
		/* Server loading imitation. Remove this */
		this.viewLoading = true;
		setTimeout(() => {
			this.dialogRef.close(true); // Keep only this row
		}, 0);
	}
}
