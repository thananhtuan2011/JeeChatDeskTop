import { ConversationService } from './../../../services/conversation.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-group-name',
  templateUrl: './edit-group-name.component.html',
  styleUrls: ['./edit-group-name.component.scss']
})
export class EditGroupNameComponent implements OnInit {
  lstGroup: any = {};
  GroupName:string;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private conversation_sevices:ConversationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<EditGroupNameComponent>,) {

   }
 
   CloseDia(data = undefined)
   {
       this.dialogRef.close(data);
   }
   goBack() {
   
      this.dialogRef.close();
    
    }


   
    
    
    EditGroupName()
    {
  
      this.conversation_sevices.EditNameGroup(this.data.IdGroup,this.GroupName).subscribe(res=>
        {
          if (res && res.status === 1) {
            this.CloseDia(res);
          }
        })
      
    }
    
submit()
{
  this.EditGroupName();
}

  ngOnInit(): void {
    this.lstGroup=this.data
    this.GroupName=this.lstGroup.GroupName

  }

}
