
import { Component, OnInit, Input } from '@angular/core';
import { JeeMeetingService } from 'src/app/services/jee-meeting.service';

@Component({
  selector: 'kt-avatar-user',
  templateUrl: './avatar-user.component.html',
})
export class AvatarUserComponent implements OnInit {

  @Input() image:string = '';
  @Input() name:string = '';
  @Input() info:string = '';
  @Input() size:number = 25;
  @Input() textcolor:any = 'black';
  @Input() showFull:boolean = false;
  constructor(
    public jeerequestservice: JeeMeetingService
  ) { }

  ngOnInit() {
  }

}
