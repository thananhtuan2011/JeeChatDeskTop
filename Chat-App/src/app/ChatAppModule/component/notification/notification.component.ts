import { environment } from 'src/environments/environment';
import { SocketioService } from './../../../services/socketio.service';
import { LayoutUtilsService, MessageType } from './../../../crud/utils/layout-utils.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Output() loadUnreadList = new EventEmitter();
  listNoti:any[]=[]
  constructor(  public translate: TranslateService,
    private socketService: SocketioService,
    private router: Router,
     private layoutUtilsService:LayoutUtilsService,) { }

  ngOnInit(): void {
    this.getListNoti();
    this.socketService.connect();
    this.socketService.listen().subscribe( (res:any) => {
      res.createdDate = moment(res.createdDate).format("hh:mm A - DD/MM/YYYY")
      if(this.listNoti.indexOf(res._id) < 0) { //đã tồn tại thì ko add vào list

        this.listNoti.unshift(res) //thông báo mới nhất thêm vào phía trước
        const _messageType = this.translate.instant(res.message_json.Content);
        const fullname = this.translate.instant(res.message_json.Fullname);
        const avatar= this.translate.instant(res.message_json.Img);
					this.layoutUtilsService.Notifi(_messageType,fullname,avatar, MessageType.Update, 3000, true, false, 3000, 'bottom','start', 1).afterDismissed().subscribe(tt => {
					});
        this.loadUnreadList.emit(true)
         this.getListNoti();
     
        
      } 
      
    })
  }
 
  clickRead(noti: any) {
    this.socketService.readNotification(noti._id).subscribe(res => {
      this.listNoti.forEach(x => {
        if (x.id == noti.id) {
          x.read = true;
        }
      });
      this.getListNoti();
      if (noti.message_json.Link != null && noti.message_json.Link != "") {
        let domain = ""
        if (noti.message_json.AppCode != environment.APPCODE) {
          domain = noti.message_json.Domain
          window.open(domain + noti.message_json.Link, '_blank');
        }else{
          this.router.navigate([noti.message_json.Link]);
        }
      }
      this.loadUnreadList.emit(true)
    });
  }

  getListNoti() {
    this.socketService.getNotificationList('').subscribe( res => {
      res.forEach(x => {
          x.createdDate = moment(x.createdDate).format("hh:mm A - DD/MM/YYYY")
          if((x.message_json == null || x.message_json.Content == null) && x.message_text == null) {
              x.message_text = "Thông báo không có nội dung"
          }
      });
      this.listNoti = res;
      console.log('  this.listNoti',  this.listNoti)
      this.loadUnreadList.emit(true) //load thành công list load số thông báo chưa đọc
      
    })
  }
  
  DanhDauDaXem(){
    this.socketService.ReadAll().subscribe(res => {
      this.getListNoti();
      this.loadUnreadList.emit(true)
    });
  }
}
