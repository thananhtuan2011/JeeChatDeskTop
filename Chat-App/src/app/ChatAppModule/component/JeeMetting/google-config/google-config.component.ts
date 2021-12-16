import { LayoutUtilsService, MessageType } from './../../../../crud/utils/layout-utils.service';
import { DangKyCuocHopService } from './../../../../services/dang-ky-cuoc-hop.service';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-google-config',
  templateUrl: './google-config.component.html'
})
export class GoogleConfigComponent implements OnInit {
  itemForm: FormGroup;
  disablebtn:boolean = false
  @ViewChild("focusInput", { static: true }) focusInput: ElementRef;
  constructor(public dialogRef: MatDialogRef<GoogleConfigComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
    private itemFB: FormBuilder,
    private dangKyCuocHopService: DangKyCuocHopService,
    private changeDetectorRefs: ChangeDetectorRef,private layoutUtilsService: LayoutUtilsService,  ) { }

  ngOnInit(): void {
    this.createForm()
    this.focusInput.nativeElement.focus();
  }
  createForm() {
		this.itemForm = this.itemFB.group({
			APIKey: ["", Validators.required],
      APISecret: ["", Validators.required],
		});
		this.itemForm.controls["APIKey"].markAsTouched();
	}
  onSumbit() {
    this.disablebtn = true
		const controls = this.itemForm.controls;
		/** check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
      this.disablebtn = false
			return;
		}
		let updatedonvi = this.Prepareleave();
		this.AddItem(updatedonvi);
	}

	Prepareleave(): any {
		const controls = this.itemForm.controls;
		let item = {
			APIkEY: controls['APIKey'].value,
			APISECRET: controls['APISecret'].value,
		};
		return item;
	}
	AddItem(item: any) {
		this.dangKyCuocHopService.setUpConfigGoogle(item).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
        this.disablebtn = false
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSumbit();
		}
	}
	goBack() {
		this.dialogRef.close();
	}
	huongdan(){
		window.open('http://help.jee.vn/articles/86-cau-hinh-cuoc-hop-truc-tuyen-google-meet', '_blank');
	}
}
