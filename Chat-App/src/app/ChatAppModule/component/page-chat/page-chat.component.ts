import { environment } from 'src/environments/environment';
import { PresenceService } from './../../../services/presence.service';
import { AccountService } from './../../../services/account.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-page-chat',
  templateUrl: './page-chat.component.html',
  styleUrls: ['./page-chat.component.scss']
})
export class PageChatComponent implements OnInit {
  title = 'CHAT-APP';
  loading = false;
  constructor(public accountService: AccountService, private presence: PresenceService, private toastr: ToastrService) {
    this.createOnline$().subscribe(isOnline => this.showNotification(isOnline));  
  }
  public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  ngOnInit(): void {
      this.presence.connectToken();
    this.loading = true;
    this.setCurrentUser();      
  }

  showNotification(isOnline: boolean){
    if(this.loading){
      if(isOnline){
        this.toastr.success('Kết nối mạng thành công!');
      }else{
        this.toastr.error('Lỗi kết nối mạng!');
      }
    }    
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  setCurrentUser(){
    // const user: User = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    // // const user: User = JSON.parse(localStorage.getItem('user'));
    // if(user){
     
    //   this.accountService.setCurrentUser(user);
    //   // this.presence.createHubConnection(user);
      
    // }    
  }
  

}
