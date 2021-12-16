import { ElectronIpcService } from './../../../services/electron-ipc.service';
import { SoundService } from './../../../services/sound.service';
import { environment } from './../../../../environments/environment';
import { NotifyServices } from './../../../services/notify.service';
import { SocketioService } from './../../../services/socketio.service';
import { Router } from '@angular/router';
import { ConversationService } from './../../../services/conversation.service';
import { LayoutUtilsService, MessageType } from './../../../crud/utils/layout-utils.service';
import { TestBed } from '@angular/core/testing';
import { MessageService } from './../../../services/message.service';
import { ChatService } from './../../../services/chat.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from './../../../auth/_services/auth.service';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PresenceService } from 'src/app/services/presence.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateConvesationGroupComponent } from '../create-convesation-group/create-convesation-group.component';
import { CreateConversationUserComponent } from '../create-conversation-user/create-conversation-user.component';
import { TranslateService } from '@ngx-translate/core';
import { first, take } from 'rxjs/operators';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { CallVideoComponent } from '../call-video/call-video.component';
import { UserModelGroup } from '../../models/NotifyMess';

declare function desktop_notify(item) :any
@Component({
  selector: 'app-my-chat',
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss']
})
export class MyChatComponent implements OnInit ,OnDestroy {
  private _subscriptions: Subscription[] = [];
  searchText:string;
  contentnotfy:string;
  dem:number=0;
  customerID:number;
  active:boolean=false;
  numberInfo:number;
  listApp: any =[]
  lstUserOnline:any[]=[];
  constructor(private auth:AuthService,
   private messageService:MessageService,
    private router:Router,
    protected _sanitizer: DomSanitizer,
    private titleService: Title,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    private chatService:ChatService,
    private socketService:SocketioService,
    private conversationServices:ConversationService,
    public presence: PresenceService,
    private notify:NotifyServices,
    private _ngZone:NgZone,
    private layoutUtilsService: LayoutUtilsService,
		public dialog: MatDialog,
    private  soundsevices:SoundService,
    private  electron_services:ElectronIpcService,
    ) {
    const user = this.auth.getAuthFromLocalStorage()['user'];
    this.name=user['customData']['personalInfo']['Fullname'];
    this.Avatar=user['customData']['personalInfo']['Avatar'];
    this.BgColor=user['customData']['personalInfo']['BgColor'];
    this.UserId=user['customData']['jee-account']['userID'];
    this.customerID=user['customData']['jee-account']['customerID'];
    const dt=this.auth.getAuthFromLocalStorage();
    this.userCurrent=dt.user.username
    const sb= this.presence.OpenmessageUsername$.subscribe(data => {
      // console.log("BBBBBBBBBBBBBBBBBB",data)
      // if(data[0].UserName!==this.userCurrent)
      // {
        this.unReadMessageFromSenderUsername(data);
      // }

          })
          this._subscriptions.push(sb);
  }

  userCurrent:string;
  lstContact:any[]=[];
  name:string;
  UserId:number;
  Avatar:string;
  BgColor:string;
  CheckActiveNotify(IdGroup:any)
  {

    let index=this.lstContact.findIndex(x=>x.IdGroup==IdGroup);
    if(index>=0)
    {
      return true
    }
    else
    {
     return false
    }
    
  }
  getClass(item)
  {
    return item>0?'unread lastmess':'lastmess'

  }

  myFiles:any[]=[];
  getFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }
  UploadVideo()

  {
    const frmData = new FormData();

      frmData.append("file", this.myFiles[0],this.myFiles[0].name);

    this.chatService.UploadVideo(frmData).subscribe(res=>
      {

      })
  }

  quanlytaikhoan(){
    window.open("https://app.jee.vn/ThongTinCaNhan","_blank")
  }
  unReadMessageFromSenderUsername(datanotifi: any) {
    let active=this.electron_services.getActiveApp();
    console.log("datanotifi",datanotifi)
    let isGroup;
    //  console.log("KKKKKKKKKKKKKKKKKK",this.electron_services.getIdGroup())
    const chatgroup=Number.parseInt(this.electron_services.getIdGroup())
   
   console.log("chatgroup",chatgroup)
    let index =this.lstContact.findIndex(x=>x.IdGroup==datanotifi[0].IdGroup);
    if(index>=0)
    {
      isGroup=this.lstContact[index].isGroup;
    }


    const sb=this.messageService.Newmessage.subscribe(res=>
      {
        
        // console.log('RRRRRRRRR',res)
        if(res&&res!==undefined&&res.length>0)
        {
         
          let vitri=this.lstContact.findIndex(x=>x.IdGroup==res[0].IdGroup);
          if(vitri>0)
          {

            this.lstContact.unshift(this.lstContact[vitri]);
            this.lstContact.splice(vitri+1,1);
            this.lstContact[0].LastMess.splice(0,1,res[0]);
            this.ScrollToTop();
            this.changeDetectorRefs.detectChanges();
          }
          else{
            this.lstContact[0].LastMess.splice(0,1,res[0]);
          }

      }
      else
      {

         let vitri=this.lstContact.findIndex(x=>x.IdGroup==datanotifi[0].IdGroup);
      if(vitri>0&&vitri!==0)
      {

        this.lstContact.unshift(this.lstContact[vitri]);
        this.lstContact.splice(vitri+1,1);

        this.ScrollToTop();
        this.changeDetectorRefs.detectChanges();

      }

    }


      })
      this._subscriptions.push(sb);
  //  }




// phần danh cho TH
 if(isGroup)
 {


    if(chatgroup.toString()!==datanotifi[0].IdGroup.toString()&&this.userCurrent!==datanotifi[0].UserName)
            {
 const sb= this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup,this.userCurrent,"unread").subscribe(res=>{

        if(res.status===1)
        {

          const sbs=this.chatService.GetUnreadMessInGroup(datanotifi[0].IdGroup,this.UserId).subscribe(res=>{
            if( this.lstContact[index].UnreadMess==null|| this.lstContact[index].UnreadMess==0)
            {
              this.dem+=1;
              // this.soundsevices.playAudioMessage();
              this.electron_services.setBadgeWindow(this.dem)
              // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
             const data=this.auth.getAuthFromLocalStorage();
 
             if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
             {
               this.contentnotfy="Gửi một file đính kèm";
             }
             else{
               this.contentnotfy=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');
             }
             this.chatService.publishMessNotifiGroup(data.access_token,datanotifi[0].IdGroup,this.contentnotfy,datanotifi[0].InfoUser[0].Fullname).subscribe(res=>{
      
                                    
var customevent = new CustomEvent(
  "newMessage", 
  {
      detail: {
        UserId:datanotifi[0].InfoUser[0].ID_user,
        username:datanotifi[0].InfoUser[0].Username,
        IdGroup:datanotifi[0].IdGroup,
        isGroup:true,
        title:datanotifi[0].TenNhom,
        avatar:'../../../../assets/JeeChat.png',
        message:datanotifi[0].InfoUser[0].Fullname+":"+this.contentnotfy,
        myservice: this.chatService //passing SettingsService reference
      },
      bubbles: true,
      cancelable: true
    }
  );

  event.target.dispatchEvent(customevent); //dispatch custom event
              if(this.CheckActiveNotify(datanotifi[0].IdGroup))
              {
                desktop_notify(customevent);
                this.electron_services.setProgressBarWindows();
              }
            });
                  
  
            }
            // console.log("this.lstContact[index].UnreadMess",this.lstContact[index].UnreadMess)
            // console.log("res.data[0].slunread",res.data[0].slunread)
            if(this.lstContact[index].UnreadMess!=0&&this.lstContact[index].UnreadMess<res.data[0].slunread&&this.userCurrent!==datanotifi[0].UserName)
                {
                  console.log("Noti vào chỗ này")
                  // this.soundsevices.playAudioMessage();
                  const data=this.auth.getAuthFromLocalStorage();
                  if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
                  {
                    this.contentnotfy="Gửi một file đính kèm";
                  }
                  else{
                    this.contentnotfy=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');
                  }
                  this.chatService.publishMessNotifiGroup(data.access_token,datanotifi[0].IdGroup, this.contentnotfy,datanotifi[0].InfoUser[0].Fullname).subscribe(res=>{
                   
                 
                               
 
                    
                 
                });
                let vitriafter =this.lstContact.findIndex(x=>x.IdGroup==datanotifi[0].IdGroup);
                this.lstContact[vitriafter].UnreadMess=res.data[0].slunread;
                var customevent = new CustomEvent(
                  "newMessage", 
                  {
                      detail: {
                        UserId:datanotifi[0].InfoUser[0].ID_user,
                        username:datanotifi[0].InfoUser[0].Username,
                        IdGroup:datanotifi[0].IdGroup,
                        isGroup:true,
                        title:datanotifi[0].TenNhom,
                        avatar:'../../../../assets/JeeChat.png',
                        message:datanotifi[0].InfoUser[0].Fullname+":"+this.contentnotfy,
                        myservice: this.chatService //passing SettingsService reference
                      },
                      bubbles: true,
                      cancelable: true
                    }
                  );
                
                  event.target.dispatchEvent(customevent); //dispatch custom event
                                    if(this.CheckActiveNotify(datanotifi[0].IdGroup))
                              {
                                desktop_notify(customevent)
                                this.electron_services.setProgressBarWindows();
                              }
                                   
                }
              
                this.lstContact[0].UnreadMess=res.data[0].slunread;
               this._subscriptions.push(sbs);
            this.changeDetectorRefs.detectChanges();

          }
          )
        }

      })
    }
    else if(this.userCurrent==datanotifi[0].UserName){
// dành cho trường hợp offline
      setTimeout(() => {
let useroffline:any[]=[];
let userpusnotify=[];
       let vitritb=this.lstContact.findIndex(x=>x.IdGroup==datanotifi[0].IdGroup)
       if( this.lstUserOnline.length>0)
       {

      
        this.lstUserOnline.forEach(element => {

           useroffline = this.lstContact[vitritb].ListMember.filter(word => word.Username !=element.Username&&word.Username!=this.userCurrent);
    
          // for(let i=0;i<this.lstContact[vitritb].ListMember.length;i++)
          // {
          //     if(element.Username!=this.lstContact[vitritb].ListMember[i].Username)
          //     {
          //       useroffline.push(this.lstContact[vitritb].ListMember[i].Username)
          //     }
          // }
        });

        useroffline.forEach(element => {
          userpusnotify.push(element.Username)
        });
      }
      else
      {
        useroffline = this.lstContact[vitritb].ListMember.filter(word => word.Username!=this.userCurrent);
        useroffline.forEach(element => {
          userpusnotify.push(element.Username)
        });
      }
     

         this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup,this.userCurrent,"read").subscribe(res=>{
         if(res.status===1)
         {
          if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
          {
            this.contentnotfy="Gửi một file đính kèm";
          }
          else{
            this.contentnotfy=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');
          }
        
          const data=this.auth.getAuthFromLocalStorage();
          const us=new UserModelGroup();
          us.lstUserTbGroup=userpusnotify

          this.chatService.publishMessNotifiGroupOffline(data.access_token,us,datanotifi[0].IdGroup, this.contentnotfy,datanotifi[0].InfoUser[0].Fullname).subscribe(res=>{

        });
      
          
       
        
         }
         else{
          console.log("Eror update status message")
         }
       })
      }, 2000);
    }
// phần dành cho active windows
if(chatgroup.toString()!==datanotifi[0].IdGroup.toString()&&this.userCurrent!==datanotifi[0].UserName)
{
const sb= this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup,this.userCurrent,"unread").subscribe(res=>{

if(res.status===1)
{

const sbs=this.chatService.GetUnreadMessInGroup(datanotifi[0].IdGroup,this.UserId).subscribe(res=>{
if( this.lstContact[index].UnreadMess==null|| this.lstContact[index].UnreadMess==0)
{
  this.dem+=1;
  // this.soundsevices.playAudioMessage();
  this.electron_services.setBadgeWindow(this.dem)
  // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
 const data=this.auth.getAuthFromLocalStorage();

 if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
 {
   this.contentnotfy="Gửi một file đính kèm";
 }
 else{
   this.contentnotfy=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');
 }
 this.chatService.publishMessNotifiGroup(data.access_token,datanotifi[0].IdGroup,this.contentnotfy,datanotifi[0].InfoUser[0].Fullname).subscribe(res=>{

                        
var customevent = new CustomEvent(
"newMessage", 
{
detail: {
UserId:datanotifi[0].InfoUser[0].ID_user,
username:datanotifi[0].InfoUser[0].Username,
IdGroup:datanotifi[0].IdGroup,
isGroup:true,
title:datanotifi[0].TenNhom,
avatar:'../../../../assets/JeeChat.png',
message:datanotifi[0].InfoUser[0].Fullname+":"+this.contentnotfy,
myservice: this.chatService //passing SettingsService reference
},
bubbles: true,
cancelable: true
}
);

event.target.dispatchEvent(customevent); //dispatch custom event
  if(this.CheckActiveNotify(datanotifi[0].IdGroup))
  {
    desktop_notify(customevent);
    this.electron_services.setProgressBarWindows();
  }
});
      

}
// console.log("this.lstContact[index].UnreadMess",this.lstContact[index].UnreadMess)
// console.log("res.data[0].slunread",res.data[0].slunread)
if(this.lstContact[index].UnreadMess!=0&&this.lstContact[index].UnreadMess<res.data[0].slunread&&this.userCurrent!==datanotifi[0].UserName)
    {
      console.log("Noti vào chỗ này")
      // this.soundsevices.playAudioMessage();
      const data=this.auth.getAuthFromLocalStorage();
      if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
      {
        this.contentnotfy="Gửi một file đính kèm";
      }
      else{
        this.contentnotfy=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');
      }
      this.chatService.publishMessNotifiGroup(data.access_token,datanotifi[0].IdGroup, this.contentnotfy,datanotifi[0].InfoUser[0].Fullname).subscribe(res=>{
       
     
                   

        
     
    });
    let vitriafter =this.lstContact.findIndex(x=>x.IdGroup==datanotifi[0].IdGroup);
    this.lstContact[vitriafter].UnreadMess=res.data[0].slunread;
    var customevent = new CustomEvent(
      "newMessage", 
      {
          detail: {
            UserId:datanotifi[0].InfoUser[0].ID_user,
            username:datanotifi[0].InfoUser[0].Username,
            IdGroup:datanotifi[0].IdGroup,
            isGroup:true,
            title:datanotifi[0].TenNhom,
            avatar:'../../../../assets/JeeChat.png',
            message:datanotifi[0].InfoUser[0].Fullname+":"+this.contentnotfy,
            myservice: this.chatService //passing SettingsService reference
          },
          bubbles: true,
          cancelable: true
        }
      );
    
      event.target.dispatchEvent(customevent); //dispatch custom event
                        if(this.CheckActiveNotify(datanotifi[0].IdGroup))
                  {
                    desktop_notify(customevent)
                    this.electron_services.setProgressBarWindows();
                  }
                       
    }
  
    this.lstContact[0].UnreadMess=res.data[0].slunread;
   this._subscriptions.push(sbs);
this.changeDetectorRefs.detectChanges();

}
)
}

})
    this._subscriptions.push(sb);
 }
}
 else
 {

// cần check ở chỗ này
 // dành cho user lúc online
    if(chatgroup.toString()!=datanotifi[0].IdGroup.toString())
    {


        if(index>=0&&this.userCurrent!==datanotifi[0].UserName)
        {
          this.chatService.UpdateUnRead(datanotifi[0].IdGroup,this.UserId,"unread").subscribe(res=>{

            if(res.status===1)
            {

              this.chatService.GetUnreadMess(datanotifi[0].IdGroup).subscribe(res=>{
                if( this.lstContact[index].UnreadMess==null|| this.lstContact[index].UnreadMess==0)
                {
                 
                  this.dem+=1;
                  this.electron_services.setBadgeWindow(this.dem)
                  // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
                }
                if(  this.lstContact[index].UnreadMess<res.data[0].slunread)
                {
                  // this.soundsevices.playAudioMessage();
                  const data=this.auth.getAuthFromLocalStorage();
                  if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
                  {
                    this.contentnotfy="Gửi một file đính kèm";
                  }
                  else{
                     this.contentnotfy=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');

                  }

                  this.chatService.publishMessNotifi(data.access_token,datanotifi[0].IdGroup, this.contentnotfy,datanotifi[0].InfoUser[0].Fullname,datanotifi[0].InfoUser[0].Avatar).subscribe(res=>{

                });
              
                }
                var customevent = new CustomEvent(
                  "newMessage", 
                  {
                      detail: {
                        UserId:datanotifi[0].InfoUser[0].ID_user,
                        username:datanotifi[0].InfoUser[0].Username,
                        IdGroup:datanotifi[0].IdGroup,
                        isGroup:false,
                        title:datanotifi[0].InfoUser[0].Fullname,
                        avatar:datanotifi[0].InfoUser[0].Avatar,
                        message:this.contentnotfy,
                        myservice: this.chatService //passing SettingsService reference
                      },
                      bubbles: true,
                      cancelable: true
                    }
                  );
                
                  event.target.dispatchEvent(customevent); //dispatch custom event
                console.log("this.CheckActiveNotify(datanotifi[0].IdGroup)",this.CheckActiveNotify(datanotifi[0].IdGroup))
                if(this.CheckActiveNotify(datanotifi[0].IdGroup))
                {
                  desktop_notify(customevent)
                  this.electron_services.setProgressBarWindows();
                }
                // sẽ đưa lên đầu tiên và + thêm số lượng
                this.lstContact[0].UnreadMess=res.data[0].slunread;
                this.changeDetectorRefs.detectChanges();
              })
            }
            else
            {
              return;
            }
          })
        }
        // else
        // {
        //   this.chatService.UpdateUnReadGroup(IdGroup, this.userCurrent,"unread").subscribe(res=>{

        //     if(res.status===1)
        //     {
        //     }
        //     else
        //     {
        //       return;
        //     }
        //   })

        // }

      }
        else
        {
          // dành cho user lúc offline
          let check=this.lstUserOnline.findIndex(x=>x.Username==this.lstContact[0].Username);
          if(check<0)
          {
          this.chatService.UpdateUnRead(datanotifi[0].IdGroup,this.lstContact[index].UserId,"unread").subscribe(res=>{
            if(res.status===1)
            {
              const data=this.auth.getAuthFromLocalStorage();
              let conent;
              if(datanotifi[0].Attachment.length>0||datanotifi[0].Attachment_File.length>0)
                  {
                    conent="Gửi một file đính kèm";
                  }
                  else{
                    conent=datanotifi[0].Content_mess.replace(/<[^>]+>/g,'');

                  }
              this.chatService.publishMessNotifiOfline(data.access_token,datanotifi[0].IdGroup,conent,datanotifi[0].InfoUser[0].Fullname,datanotifi[0].InfoUser[0].Avatar).subscribe(res=>{
    
              });
              // let noti={
              //   title:datanotifi[0].InfoUser[0].Fullname,
              //   avatar:datanotifi[0].InfoUser[0].Avatar,
              //   message:this.contentnotfy
              // }
              //  this.electron_services.Notify(noti)
            }
            else
            {
              return;
            }
          })
        
        }
      }
      }

      }

  UpdateUnreadMess(IdGroup:number,UserId:number,count:number)
  {
    if(this.searchText)
    {
      this.searchText="";
    }
this.electron_services.setIdGroup(IdGroup)
    // localStorage.setItem('chatGroup', JSON.stringify(IdGroup));
    if(count>0)
    {


    let index =this.lstContact.findIndex(x=>x.IdGroup==IdGroup);
    this.lstContact[index].UnreadMess=0;
    if(this.dem>0)
         {
          this.dem=this.dem-1;
         }
    this.electron_services.setBadgeWindow(this.dem)
    this.chatService.UpdateUnRead(IdGroup,UserId,"read").subscribe(res=>{
      if(res)
      {


      }
      else{
        console.log("Eror")
      }
    })
    this.changeDetectorRefs.detectChanges();
  }
  }

  UpdateUnreadMessGroup(IdGroup:number,userUpdateRead:string,count:number)
  {
    this.electron_services.setIdGroup(IdGroup)
    if(count>0)
    {


    let index =this.lstContact.findIndex(x=>x.IdGroup==IdGroup);
    this.lstContact[index].UnreadMess=0;
    if(this.dem>0)
         {
          this.dem=this.dem-1;
         }
    this.electron_services.setBadgeWindow(this.dem)
    this.chatService.UpdateUnReadGroup(IdGroup,userUpdateRead,"read").subscribe(res=>{
      if(res.status===1)
      {

      }
    })
    this.changeDetectorRefs.detectChanges();
  }
  }
  // mở khung chat tự động
  // unReadMessageFromSenderUsername(IdGroup: any) {
  //   let index =this.lstContact.findIndex(x=>x.IdGroup==IdGroup);
  //   if(index>=0&&this.lstContact[index].Active===1&&this.lstContact[index].isGroup==false


  //     )
  //   {


  //     this.chatService.UpdateUnRead(IdGroup,"read").subscribe(res=>{
  //       if(res.status===1)
  //       {

  //       }
  //       else
  //       {
  //         return;
  //       }
  //     })
  //   }
  //   else{
  //     //Update unread
  //     this.chatService.UpdateUnRead(IdGroup,"unread").subscribe(res=>{
  //       if(res.status===1)
  //       {

  //       }
  //       else
  //       {
  //         return;
  //       }
  //     })
  //   }

  //   if(index>=0&&this.lstContact[index].isGroup==true)
  //   {

  //   }


  // }
  loadUnreadList: EventEmitter<boolean> = new EventEmitter<boolean>();
  updateNumberNoti(value) {
    if(value == true) {
      this.getNotiUnread()
    }
  }

  getNotiUnread() {
    this.socketService.getNotificationList('unread').subscribe( res => {
      let dem = 0;
      res.forEach(x => dem++);
      this.numberInfo = dem;
      this.changeDetectorRefs.detectChanges();
    })
  }


  logout() {
    this.auth.logoutToSSO().subscribe((res) => {
      localStorage.clear();
      this.auth.logout();
    });
  this.presence.disconnectToken();
  }
  // đọc tất cả tin nhắn
  listAllread:any[]=[];
  AllRead()
  {
    this.listAllread=[];
    this.listTam.forEach(item=>
      {
        if(item.UnreadMess>0)
        {
          this.listAllread.push(item);

        }

      })
      this.listAllread.forEach(item=>
        {
          //user bt

          let index=this.lstContact.findIndex(x=>x.IdGroup==item.IdGroup);
          if(index>=0)
          {
            this.lstContact[index].UnreadMess=0;
          }
          if(item.isGroup)
          {
            this.chatService.UpdateUnRead(item.IdGroup,item.UserId,"read").subscribe(res=>{
              if(res)
              {


              }
              else{
                console.log("Eror")
              }
            })

          }
          else
          {
            //  group

            this.chatService.UpdateUnReadGroup(item.IdGroup,item.Username,"read").subscribe(res=>{
              if(res.status===1)
              {

              }
              else{
                console.log("Eror")
              }
            })
          }

        })
        this.dem=0;
        this.changeDetectorRefs.detectChanges();
  }
  listunread:any[]=[];
  listTam:any[]=[];
  changed(item)
  {
    this.listunread=[];
    if(item==1)
    {
      this.GetContact();
    }else if(item==2)
    {

      this.listTam.forEach(item=>
        {
          if(item.UnreadMess>0)
          {
            this.listunread.push(item);
          }

        })
        this.lstContact= this.listunread.slice();
        this.changeDetectorRefs.detectChanges();
    }
    else if(item==3)
    {
      this.listTam.forEach(item=>
        {
          if(item.UnreadMess==0)
          {
            this.listunread.push(item);
          }

        })
        this.lstContact= this.listunread.slice();
        this.changeDetectorRefs.detectChanges();
    }
  }
  GetContact()
  {
    this.lstContact=[];
    if(this.lstContact.length==0)
    {
      this.active=true;
    }
    const sb=this.chatService.GetContactChatUser().subscribe(res=>{
        this.lstContact=res.data;
        this.listTam=res.data
        this.changeDetectorRefs.detectChanges();
        this.getSoLuongMessUnread();
        console.log('lstContact',this.lstContact)
        this.active=false;
      })
      this._subscriptions.push(sb)
  }
 // Bắt đầu phần bài đăng
 creaFormDelete(IdGroup: number,isGroup:boolean) {
  const _title = this.translate.instant('Xóa cuộc hội thoại');
  const _description = this.translate.instant('Bạn có muốn xóa không ?');
  const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
  const _deleteMessage = this.translate.instant('Xóa thành công !');
  const _erroMessage = this.translate.instant('Xóa không thành công !');
  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe((res) => {
    if (!res) {
      return;
    }

    if(isGroup)
    {
      // xóa group nhóm thực  chất là rời nhóm
      this.conversationServices.DeleteThanhVienInGroup(IdGroup,this.UserId).subscribe(res=>{

        if(res&&res.status==1)
        {

          this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
           this.GetContact();


        }
        else
        {
          this.layoutUtilsService.showActionNotification('Thất bại !', MessageType.Read, 3000, true, false, 3000, 'top', 0);

        }
    })

    }
    else{

   // xóa group user với nhau
    const sb = this.conversationServices.DeleteConversation(IdGroup).subscribe((res) => {


      if (res && res.status === 1) {
        this.router.navigateByUrl('/Chat')
        let index=this.lstContact.findIndex(x=>x.IdGroup==IdGroup);
        if(index>=0)
        {

          this.lstContact.splice(index,1)
          this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
          // this.GetContact();
        }

        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
      } else {
        this.layoutUtilsService.showActionNotification(_erroMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 0);
      }


      this._subscriptions.push(sb);

    });
  }
  });
}
GetListApp()
{
  this.notify.getListApp().subscribe( res => {
    if(res.status == 1){
      this.listApp = res.data
    }
  })
}
getSoLuongMessUnread()
{this.dem=0;
  if( this.lstContact)
  {


  this.lstContact.forEach(element => {
    if(element.UnreadMess>0)
    {
      this.dem+=1
    }
  });
  this.electron_services.setBadgeWindow(this.dem)
  // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
}
}

setIntrvl(){
    setInterval(() => {

      if (this.dem>0) {
        this.getSoLuongMessUnread()

      }

    }, 1000);

}

// setIntrvl1(){
//   setInterval(() => {

//     if (this.dem>0) {
//       this.titleService.setTitle('('+this.dem+')'+" JeeChat");

//     }else if (this.dem===0)
//     {
//       this.titleService.setTitle("JeeChat");
//     }

//   }, 2000);

// }
  ngOnInit(): void {
    this.setIntrvl();
    // this.electron_services.getActiveApp();
    console.log("this.electron_services.getActiveApp();",this.electron_services.getActiveApp())
    // this.setIntrvl1();
    // if(this.dem=0)
    // {
    //   this.titleService.setTitle('('+this.dem+')'+" JeeChat");
    // }
      this.GetListApp();
    this.presence.connectToken();
    this.GetContact();
    this.subscribeToEvents();
    this.subscribeToEventsOffLine();
    this.UpdateNewGroup();
   this.RefreshConverstionWhenDeleteMember();
  // this.subscribeToEventsNewMess();
this.EventSubcibeCallVideo();
this.subscribeToEventsHidenmes();
this.eventsubrouterNotify();
  }

  eventsubrouterNotify()
  {
    this.chatService.notify$.subscribe(res=>{
      if(res)
      {
        this.electron_services.OpenAppNotify();
      //  console.log("CCCC",res);
      if(!res.isGroup)
       {

       
        this.chatService.UpdateUnRead(res.IdGroup,res.UserId,"read").subscribe(data=>{
       console.log("UpdateUnReadGroup",data)
        if(data.status==1)
        {
         if(this.dem>0)
         {
          this.dem=this.dem-1;
         }
        
          this.electron_services.setBadgeWindow(this.dem);
          let index=this.lstContact.findIndex(x=>x.IdGroup==res.IdGroup);
          if(index>=0)
          {
            this.lstContact[index].UnreadMess=0;
          }
        }

       });
      }
      else{
        this.chatService.UpdateUnReadGroup(res.IdGroup,this.userCurrent,"read").subscribe(res=>{

        });
      }
      
      if(this.dem>0)
      {
       this.dem=this.dem-1;
      }
       this.electron_services.setBadgeWindow(this.dem);
       let index=this.lstContact.findIndex(x=>x.IdGroup==res.IdGroup);
       if(index>=0)
       {
         this.lstContact[index].UnreadMess=0;
       }
       this.electron_services.setIdGroup(res.IdGroup)
       this.router.navigateByUrl(`/Chat/Messages/${res.IdGroup}/null`);
       this.changeDetectorRefs.detectChanges();
      }
      
    })
  }
  private subscribeToEventsHidenmes(): void {


    const sb=this.messageService.MyChatHidden$.subscribe(res=>
      {
        if(res)
        {
          let index=this.lstContact.findIndex(x=>x.IdGroup==res.IdGroup);
            if(index>=0)
            {
              if(this.lstContact[index].LastMess[0].IdChat==res.IdChat)
              {
                this.lstContact[index].LastMess[0].isHiden=true;
                this.changeDetectorRefs.detectChanges();
              }

            }

        }
      })



    }
    
  CheckCall(idGroup)
  {
    let index=this.lstContact.findIndex(x=>x.IdGroup==idGroup);
    if(index>=0)
    {
      return true
    }
    else{
      return false
    }
  }



  private EventSubcibeCallVideo(): void {

    this.presence.CallvideoMess.subscribe(res=>
      { 
        // console.log("CallVideo",res)
        if(res&&this.CheckCall(res.IdGroup)&&res.UserName!==this.userCurrent)
        {


          this.CallVideoDialogEvent(res.isGroup,res.UserName,res.Status,res.keyid,res.IdGroup,res.FullName,res.Avatar,res.BGcolor);

        }


      })

  }

  CallVideoDialogEvent(isGroup,username,code,key,idgroup,fullname,img,bg) {


    var dl={isGroup:isGroup,UserName:username,BG:bg,Avatar:img,PeopleNameCall:fullname,status:code,idGroup:idgroup,keyid:key,Name:fullname};
    const dialogRef = this.dialog.open(CallVideoComponent, {
  //  width:'800px',
  // height:'800px',
  data: {dl },
  disableClose: true

    });
  dialogRef.afterClosed().subscribe(res => {

          if(res)
    {
      this.presence.ClosevideoMess.next(undefined)

      this.changeDetectorRefs.detectChanges();
    }
          })


  }
  RefreshConverstionWhenDeleteMember()
  {
      this.conversationServices.refreshConversation.subscribe(res=>
        {
          if(res)
          {
              let index=this.lstContact.findIndex(x=>x.IdGroup==res.IdGroup&&x.UserId===res.UserId.data);
              if(index>=0)
              {
                this.lstContact.splice(index,1);
                this.changeDetectorRefs.detectChanges();
              }
          }
        })
  }
  UpdateNewGroup()
  {
	this._ngZone.run(() => {

	  this.presence.NewGroupSource$.subscribe(res=>
		{
      // console.log("RESSS",res)
		  if(res&&res.isGroup)
		  {
			let index=this.lstContact.findIndex(x=>x.IdGroup===res.IdGroup)
			if(index<0)
			{
			  this.lstContact.unshift(res);
			  this.changeDetectorRefs.detectChanges();
			}


		  }
      else
      {
        if(res&&!res.isGroup)
        {

          let index=this.lstContact.findIndex(x=>x.IdGroup===res.IdGroup)
          if(index<0)
          {
            this.lstContact.unshift(res);
            this.changeDetectorRefs.detectChanges();
          }

        }

      }

		})
	  })
  }

	CreaterGroupChat() {
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(CreateConvesationGroupComponent, {
  width:'500px',

      // panelClass:'no-padding'

    });
  dialogRef.afterClosed().subscribe(res => {


          if(res)
    {
      const data = this.auth.getAuthFromLocalStorage();
    this.presence.NewGroup(data.access_token,res[0],res[0])
      // this.GetContact();
      // this.subscribeToEvents();
      // this.GetContact();
      this.changeDetectorRefs.detectChanges();
    }
          })

    }


CreaterUserChat() {
  // this.dcmt.body.classList.add('header-fixed');
  const dialogRef = this.dialog.open(CreateConversationUserComponent, {
  width:'500px',

    // panelClass:'no-padding'

  });
dialogRef.afterClosed().subscribe(res => {

        if(res)

    {
      this.electron_services.setIdGroup(res[0].IdGroup)
      // localStorage.setItem('chatGroup', JSON.stringify(res[0].IdGroup));
      this.router.navigate(['Chat/Messages/'+res[0].IdGroup+'/null']);
      const data = this.auth.getAuthFromLocalStorage();
      this.presence.NewGroup(data.access_token,res[0],res[0])
      // this.GetContact();
      // this.subscribeToEvents();
      // this.GetContact();
    this.changeDetectorRefs.detectChanges();
    }
        })

  }
  private subscribeToEventsOffLine(): void {

    this._ngZone.run(() => {

    this.presence.offlineUsers$.subscribe(res=>
      {
       
        if(res)
        {

     
        if(res.JoinGroup==="changeActive" )
        {
            this.SetActive(res.UserId,true)
        }
        // else if(res[i].JoinGroup==="")
        // {
        //   this.SetActive(res[i].UserId,false)
        // }
        else
        {
          this.SetActive(res.UserId,false)
        }
      }
      })
    })

  }

  private subscribeToEvents(): void {

    this._ngZone.run(() => {

    this.presence.onlineUsers$.subscribe(res=>
      {
        console.log("onlineUsers",res)
        this.lstUserOnline=res;
        console.log(" this.lstUserOnline", this.lstUserOnline)
     
        setTimeout(() => {
          
   
        if(res.length>0)
        {


       for(let i=0;i<res.length;i++)
       {
        if(res[i].JoinGroup==="changeActive" )
        {
            this.SetActive(res[i].UserId,true)
        }
        else
        {
          this.SetActive(res[i].UserId,false)
        }
       }
      }
    }, 1000);
      })
    })

  }
  SetActive(item:any,active=true)
  {  let index;
      setTimeout(() => {
          index =this.lstContact.findIndex(x=>x.UserId===item && x.isGroup===false);



      if(index>=0)
      {

        this.lstContact[index].Active = active ? true : false;
        this.changeDetectorRefs.detectChanges();

      }


      }, 500);
  }

  ngOnDestroy() {
    if(this._subscriptions)
    {
      this._subscriptions.forEach((sb) => sb.unsubscribe());
    }
    // this.messageService.Newmessage.unsubscribe();
  }
  @ViewChild('scrollMeChat', { static: false }) scrollMeChat: ElementRef;
  ScrollToTop(): void {
    this.scrollMeChat.nativeElement.scrollIntoView({behavior: 'smooth'});
  }



}
