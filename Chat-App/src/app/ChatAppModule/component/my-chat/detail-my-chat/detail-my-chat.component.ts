import { LayoutUtilsService } from './../../../../crud/utils/layout-utils.service';
import { MessageService } from './../../../../services/message.service';
import { PresenceService } from 'src/app/services/presence.service';
import { AuthService } from './../../../../auth/_services/auth.service';
import { ChatService } from './../../../../services/chat.service';
import { ChangeDetectorRef, Component, Input, OnInit, NgZone, ElementRef, ViewChild, HostListener, OnDestroy, TemplateRef } from '@angular/core';
import { QueryParamsModelNewLazy } from '../../../../ChatAppModule/models/pagram';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Message } from 'src/app/ChatAppModule/models/message';
import { FormControl, NgForm } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ThanhVienGroupComponent } from '../thanh-vien-group/thanh-vien-group.component';
import { InsertThanhvienComponent } from '../../insert-thanhvien/insert-thanhvien.component';
import { EditGroupNameComponent } from '../../edit-group-name/edit-group-name.component';
import { Gallery, GalleryItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import * as moment from 'moment-timezone';
import { PopoverContentComponent } from 'ngx-smart-popover';

import { QuillEditorComponent } from 'ngx-quill';
import "quill-mention";
import { ShareMessageComponent } from '../share-message/share-message.component';
import { NotifyMessage } from 'src/app/ChatAppModule/models/NotifyMess';
import Peer from 'peerjs';
import { CallVideoComponent } from '../../call-video/call-video.component';
import { MatAccordion, MatExpansionPanelState,matExpansionAnimations } from '@angular/material/expansion';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { DangKyCuocHopPageComponent } from '../../JeeMetting/dang-ky-cuoc-hop-page/dang-ky-cuoc-hop-page.component';
import { SeenMessModel } from 'src/app/ChatAppModule/models/SeenMess';
@Component({
  selector: 'app-detail-my-chat',
  templateUrl: './detail-my-chat.component.html',
  styleUrls: ['./detail-my-chat.component.scss'],
  animations: [matExpansionAnimations.bodyExpansion],
})
export class DetailMyChatComponent implements OnInit, OnDestroy   {
  tabs = ['Ảnh', 'File', ];
  selected = new FormControl(0);
colornav:boolean;
  LstImagePanel:any[]=[];
  LstFilePanel:any[]=[];

  allfile:boolean=false;
  allfileImage:boolean=false;
thanhviennhomn:number;
  active_SeenMess:boolean=false;
  active_tagname:boolean=true;
  active_danhan:boolean=false;
  listtagname:any[]=[];
  isGroup:boolean=false;
  listReply:any[]=[];
  lstThamGia:any[]=[];
  tam:any[]=[];
  id_chat_notify:number;
  listTagGroupAll:any[]=[];
  _lstChatMessMoreDetail:any[]=[];
  listChoseTagGroup:any[]=[];
  lisTagGroup:any[]=[];
  listInfor:any[]=[];
  list_reaction:any[]=[];
  isloading:boolean=false;
	@ViewChild('myPopoverC', { static: true }) myPopover: PopoverContentComponent;
  acivepush:boolean=true;
  @ViewChild('messageForm') messageForm: NgForm;
  messageContent:string;
  txttam:string="";
  composingname:string;
  TenGroup:string;
  show:boolean=false;
  pageSize:number=0;
  pageSizedetailbottom:number=0;
  pageSizedetailtop:number=4;
  lstChatMess:any[]=[]
  lstTagName:any[]=[]
  listMess:any[]=[];
  composing:boolean=false
  userCurrent:string;
  valtxt:string;
  UserId:number;
  Fullname:string;
  @Input() id_Group: any;
  @Input() id_Chat: any;
  loading:boolean=false;
  list_image:any[]=[];
  list_file:any[]=[];
  AttachFileChat:any[]=[];
 listFileChat:any[]=[];
 active:boolean=false;
 listreaction:any[]=[];
 Avataruser:string;
//   call video và  share creen
private peer: Peer;
peerIdShare: string;
peerId: string;
private lazyStream: any;
currentPeer: any;
private peerList: Array<any> = [];
panelOpenState = false;
customerID:number;
  private _subscriptions: Subscription[] = [];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  @ViewChild('scrollMe') private scrollMeChat: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    public gallery: Gallery,
    private changeDetectorRefs: ChangeDetectorRef,
    private chatService:ChatService,
    private route:ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    public dialog: MatDialog,
    private _ngZone:NgZone,
    private layoutUtilsService:LayoutUtilsService,
    private presence:PresenceService,
    public messageService: MessageService,
  ) {
    console.log('%c ContrustorDetail ', 'background: red; color: #bada55');

       this.peer = new Peer();
       const dt=this.auth.getAuthFromLocalStorage();
    this.userCurrent=dt.user.username;
    this.UserId=dt['user']['customData']['jee-account']['userID'];
    this.Fullname=dt['user']['customData']['personalInfo']['Fullname'];
    this.Avataruser=dt['user']['customData']['personalInfo']['Avatar'];
    this.customerID=dt['user']['customData']['jee-account']['customerID'];
    
    this.isloading=false;

  }

  RemoveVideos(index)
    {

      this.myFilesVideo.splice(index, 1);
      this.AttachFileChat.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
       this.url="";
    }


  myFilesVideo:any[]=[];

  url;
  onSelectVideo(event) {

    let base64Str: any;
    const file = event.target.files && event.target.files;
    if (file) {
      var reader = new FileReader();

      reader.onload = (event) => {
        this.myFilesVideo.push(event.target.result);
        var metaIdx = this.myFilesVideo[0].indexOf(';base64,');
         base64Str =  this.myFilesVideo[0].substr(metaIdx + 8);

       this.AttachFileChat.push({ filename: file[0].name,type:file[0].type,size:file[0].size,strBase64: base64Str });
        this.url = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(file[0]);
    }
    console.log("AttachFileChat",this.AttachFileChat)
  }

  onSelectFile_PDF(event) {

    this.show=false;

    if (event.target.files && event.target.files[0]) {

      var filesAmountcheck = event.target.files[0];


   var file_name=event.target.files;
     var filesAmount = event.target.files.length;

     for (var i = 0; i < this.AttachFileChat.length; i++) {
       if (filesAmountcheck.name == this.AttachFileChat[i].filename) {
         this.layoutUtilsService.showInfo("File đã tồn tại");
         return;
       }
     }
       for (let i = 0; i < filesAmount; i++) {
         var reader = new FileReader();
         //this.FileAttachName = filesAmount.name;
         let base64Str: any;
         let cat:any;
         reader.onload = (event) => {
        cat =  file_name[i].name.substr(file_name[i].name.indexOf('.'));
        if(cat.toLowerCase()==='.png'||cat.toLowerCase()==='.jpg')
        {
         this.list_image.push(event.target.result);

         var metaIdx = this.list_image[i].indexOf(';base64,');
         base64Str =  this.list_image[i].substr(metaIdx + 8);
         console.log("base64Str",base64Str)
        this.AttachFileChat.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size,strBase64: base64Str });
         // console.log('list imgage',this.list_image)
        }
        else
        {
         this.list_file.push(event.target.result);

         if(this.list_file[i]!=undefined)
         {
          var metaIdx = this.list_file[i].indexOf(';base64,');
         }

         if( this.list_file[i]!=undefined)
         {
          base64Str =  this.list_file[i].substr(metaIdx + 8);
         }

         this.AttachFileChat.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size,strBase64: base64Str });
       this.listFileChat.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size,strBase64: base64Str });
        // this.list_File_Edit.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size });
        }


             this.changeDetectorRefs.detectChanges();

           }


          //  console.log('this.list_image_Edit',this.list_image_Edit)
         reader.readAsDataURL(event.target.files[i]);
       }
       }

    }

    RemoveChoseFile(index)
    {
      this.AttachFileChat.splice(index, 1);
      this.listFileChat.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
    }
    RemoveChoseImage(index)
  {
    this.list_image.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
  }
	showPT()
  {
    if(this.show)
    {
      this.show=false;
    }
    else

    {
      this.show=true;
    }

  }
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  // set = 'twitter';
  set = 'facebook';
  toggleEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    let { txttam } = this;

    if(txttam===null)
    {
      txttam='';
    }
    const text = `${txttam}${event.emoji.native}`;

    this.txttam = text;
    // this.showEmojiPicker = false;
  }

  GetListThamGiaCuocHop(idgroup)
  {
    this.chatService.GetTaoUserTaoCuocHop(idgroup).subscribe(res=>{
    this.lstThamGia=res.data;
    })
  }
	TaoCuocHop() {

    const dialogRef = this.dialog.open(DangKyCuocHopPageComponent, {

  data:this.lstThamGia
      // panelClass:'no-padding'
    });
  dialogRef.afterClosed().subscribe(res => {
          if(res)
    {
      this.GetInforUserChatwith(this.id_Group)
      this.changeDetectorRefs.detectChanges();
    }
          })

    }
	EditNameGroup(item:any) {
    const dialogRef = this.dialog.open(EditGroupNameComponent, {
  width:'400px',
  data:item
      // panelClass:'no-padding'
    });
  dialogRef.afterClosed().subscribe(res => {
          if(res)
    {
      this.GetInforUserChatwith(this.id_Group)
      this.changeDetectorRefs.detectChanges();
    }
          })

    }
    HidenMess(IdChat:number,IdGroup:number)
    {  const data=this.auth.getAuthFromLocalStorage();

      var _token =data.access_token;
      this.messageService.HidenMessage(_token,IdChat,IdGroup)
    }

    ReplyMess(item)
    {

      this.listReply.push(item);
      // this.editor.focus()
     
      this.changeDetectorRefs.detectChanges();
    }



    saverange(value) {
  //  console.log("Changed", value)

   if(value)
   {
    if(value.match(/<img/))
    {
      value = value.replace(/<img(.*?)>/g, "");
    }
    value=value.replace("<p><br></p>", "");

      this.messageContent=value;


   }





      //  document.getElementById('content').textContent =value;
      if(value)
      {
        // if(value.indexOf("@")>=0)
        // {
        //   this.changeDetectorRefs.detectChanges();
        // }
        // else
        // {
        // }

    const data=this.auth.getAuthFromLocalStorage();

    var _token =data.access_token;
    this.messageService.Composing(_token, this.id_Group)
      }
      else

      {
        return;

  }
  }


ItemInsertMessenger(note:string): Message {
  const item = new Message();
  item.Content_mess='đã thêm';
  item.UserName=this.userCurrent;
  item.IdGroup=this.id_Group;
  item.IsDelAll=false;
  item.Note=note;
  item.isInsertMember=true;


  return item
}



sendInsertMessage(note:string) {

   this.isloading=false;
  const data=this.auth.getAuthFromLocalStorage();
     var _token =data.access_token;
  let  item =this.ItemInsertMessenger(note);
  this.messageService.sendMessage(_token,item,this.id_Group).then(() => {


  })





}
	InsertThanhVienGroup() {
    const dialogRef = this.dialog.open(InsertThanhvienComponent, {
  width:'500px',
  data:this.id_Group

      // panelClass:'no-padding'

    });
  dialogRef.afterClosed().subscribe(res => {
          if(res)
    {
      let chuoi="";
      res.data.forEach(element => {
        chuoi=chuoi+','+element.FullName
      });


      this.sendInsertMessage(chuoi.substring(1));
      this.GetInforUserChatwith(this.id_Group)
      this.changeDetectorRefs.detectChanges();
    }
          })

    }


    LoadDataDetailDefaultMess(idGroup,IdChat)
    {
      const queryParams1 = new QueryParamsModelNewLazy(

        '',
        '',
        '',

          0,
        50,
        false,



      );
      this.chatService.GetMessDetailDefault(idGroup,IdChat,queryParams1).subscribe(res=>
        {
          this.listMess = res.data;
          console.log("ListMessDetail",this.listMess)

          this.loadDataListLayzyDetailBottom(0);
          let index=this.listMess.findIndex(x=>x.IdChat==this.id_Chat);
          this.viewPort.scrollToIndex(index);

          this._scrollToBottom();
          this.changeDetectorRefs.detectChanges();
        })



    }
  loadDataList() {
    // this.loading=true;


		const queryParams1 = new QueryParamsModelNewLazy(

			'',
			'',
			'',

		    0,
			50,
			false,



		);
		const sb=this.chatService.GetListMess(queryParams1, `/chat/Get_ListMess?IdGroup=${this.id_Group}`).subscribe((res) => {
			this.listMess = res.data;
      console.log('listMess',this.listMess)
      this.isloading=false;
			this.changeDetectorRefs.detectChanges();







			// }


setTimeout(() => {


      if(this.listMess)
      {
        this.viewPort.scrollToIndex(this.listMess.length-1);

        setTimeout(() => {
          this.viewPort.scrollTo({
            bottom: 0,
            behavior: 'auto',
          });
        }, 0);
        setTimeout(() => {
          this.viewPort.scrollTo({
            bottom: 0,
            behavior: 'auto',
          });
        }, 50);

      }
    }, 1000);
		})
		this._subscriptions.push(sb)
	}
//  scroll bottom add thêm item
  public appendItemsDetailBottom(): void {

    this.loadDataListLayzyDetailBottom(this.pageSizedetailbottom);
    // if(this.pageSizedetailbottom==0)
    // {
    //   this.loadDataListLayzyDetailBottom(this.pageSizedetailbottom);
    // }
    // else
    // {
    //    this.loadDataListLayzyDetailBottom(this.pageSizedetailbottom);
    // }



		this.changeDetectorRefs.detectChanges();
	}

  //  scroll top add thêm item
  public appendItemsDetailTop(): void {

      this.loadDataListLayzyDetailTop();


		this.changeDetectorRefs.detectChanges();
	}
  loadDataListLayzyDetailBottom(page: number){
    this.pageSizedetailbottom+=1;
		const queryParams1 = new QueryParamsModelNewLazy(

			'',
			'',
			'',
			page,
			10,
			false,



		);



    const sb=this.chatService.GetListMessDetailBottom(queryParams1, `/chat/Get_ListMessDetailShowMoreBottom?IdGroup=${this.id_Group}&idchat=${this.id_Chat}`).subscribe((res) => {
      this._lstChatMessMoreDetail = [];
			if (res.data != null&&res.status===1) {
        this._lstChatMessMoreDetail = res.data;
        console.log('  res.data.',   this._lstChatMessMoreDetail)

          if (res.data) {
            for (let i = 0; i <    this._lstChatMessMoreDetail.length; i++) {



              this.listMess=[...this.listMess,   this._lstChatMessMoreDetail[i]];

              this.isloading=false;

              this.changeDetectorRefs.detectChanges();
            }




            console.log('listMess detail sau khi push',this.listMess)
}
// let index=this.listMess.findIndex(x=>x.IdChat==this.id_Chat);
// this.viewPort.scrollToIndex(index);
      }
		})

    if(this._lstChatMessMoreDetail.length>0)
    {

      this.viewPort.scrollToIndex(this.listMess.length-10,'smooth');
      // this.viewPort.scrollTo({
      //   bottom: 40,

      // });
      // this._scrollToBottom();
    }

		this.changeDetectorRefs.detectChanges();
		this._subscriptions.push(sb)
			// return result;

	}
  loadDataListLayzyDetailTop(){
    this.pageSizedetailtop+=1;
		const queryParams1 = new QueryParamsModelNewLazy(

			'',
			'',
			'',
			this.pageSizedetailtop,
			10,
			false,



		);



    const sb=this.chatService.GetMessDetailDefault(this.id_Group,this.id_Chat,queryParams1).subscribe((res) => {
      this._lstChatMessMoreDetail = [];

			if (res.data != null&&res.status===1) {
        this._lstChatMessMoreDetail = res.data.reverse();
          if (res.data) {
            for (let i = 0; i <    this._lstChatMessMoreDetail.length; i++) {

              this.listMess=[ this._lstChatMessMoreDetail[i],...this.listMess];

              this.isloading=false;

              this.changeDetectorRefs.detectChanges();
            }

            // console.log('listMess detail sau khi push',this.listMess)
}

      }
		})

    if(this._lstChatMessMoreDetail.length>0)
    {
      this.scroll();
    }

		this.changeDetectorRefs.detectChanges();
		this._subscriptions.push(sb)
			// return result;

	}

  private _scrollToBottom() {
    setTimeout(() => {
      this.viewPort.scrollTo({
        bottom: 20,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.viewPort.scrollTo({
        bottom: 20,
        behavior: 'auto',
      });
    }, 50);
  }
  loadDataListLayzy(page: number){

    this.isloading=true;
		const queryParams1 = new QueryParamsModelNewLazy(

			'',
			'',
			'',
			page,
			10,
			false,



		);



    const sb=this.chatService.GetListMess(queryParams1, `/chat/Get_ListMess?IdGroup=${this.id_Group}`).subscribe((res) => {
      let _lstChatMessMore = [];
			if (res.data != null&&res.status===1) {
        _lstChatMessMore = res.data.reverse();
        console.log('  res.data.',_lstChatMessMore)

          if (res.data != null) {
            for (let i = 0; i < _lstChatMessMore.length; i++) {



              this.listMess=[_lstChatMessMore[i],...this.listMess];

              this.isloading=false;

              this.changeDetectorRefs.detectChanges();
            }

} this.viewPort.scrollToIndex(10, 'smooth');

      }
		})

		this.changeDetectorRefs.detectChanges();
		this._subscriptions.push(sb)

	}

  scroll() {
    this.isloading=false;
    this.viewPort.scrollToIndex(10, 'smooth');

  }
  public appendItems(): void {
		this.pageSize += 1;
		this.loadDataListLayzy(this.pageSize);

		this.changeDetectorRefs.detectChanges();
	}


// send leave mess group


ItemLeaveMessenger(content:string,note:string): Message {
  const item = new Message();
  item.Content_mess=content;
  item.UserName=this.userCurrent;
  item.IdGroup=this.id_Group;
  item.IsDelAll=true;
  item.Note=note

  return item
}



sendLeaveMessage(mess:string,note:string) {

  this.isloading=false;
  const data=this.auth.getAuthFromLocalStorage();

     var _token =data.access_token;
  let  item =this.ItemLeaveMessenger(mess,note);
  this.messageService.sendMessage(_token,item,this.id_Group).then(() => {


  })





}

	OpenThanhVien() {
    let noidung;
    let note;
    const dialogRef = this.dialog.open(ThanhVienGroupComponent, {
  width:'500px',
  data: this.id_Group,

      // panelClass:'no-padding'

    });
  dialogRef.afterClosed().subscribe(res => {
    console.log('AAAAa',res)

          if(res)
    {
      this.GetInforUserChatwith(this.id_Group)
      if(this.UserId==res.data)
      {
        noidung='đã rời'

        this.sendLeaveMessage(noidung,'');
      }
      else

      {
        this.chatService.GetUserById(res.data).subscribe(notedata=>{
          if(notedata)
          {
          note=notedata.data[0].Fullname
          this.sendLeaveMessage(noidung,note);
        }
        })
        noidung= 'đã xóa '
      }

      this.changeDetectorRefs.detectChanges();
    }
          })

    }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    // this._isLoading$.next(true);

    this.isloading=false;
    if(this.id_Chat)
    {

      if (event.srcElement.scrollTop ==0) {

        // this.appendItems();
        // alert("top bằng 0")
        this.appendItemsDetailTop();

      }

    // console.log("event.target.offsetHeight",event.target.offsetHeight)
    // console.log("event.target.scrollTop",event.target.scrollTop)
    // console.log("event.target.scrollHeight",event.target.scrollHeight)
    // console.log("event.target.clientHeight",event.target.clientHeight)

        if (event.target.scrollHeight  - event.target.scrollTop == event.target.clientHeight) {

             this.appendItemsDetailBottom();

        }
    }

    else
    {

    if (event.srcElement.scrollTop==0) {

      this.appendItems();
    }


    }






  }

  RouterLink(item){
    window.open(item,"_blank")
  }

  getClassHidenTime(item,idchat)
 {
   if(this.id_Chat)
   {
    if(item&&this.id_Chat==idchat)
    {
      return 'HidenTime zoom-in-zoom-out';
    }
    else if(item)

    {
      return 'HidenTime';
    }
    else if(this.id_Chat==idchat)
    {
      return 'zoom-in-zoom-out';
    }
    else
    {
      return '';
    }
   }
   else

   {


   if(item)
   {
     return 'HidenTime';
   }
   else

   {
     return '';
   }
  }
  }

  getClassReply(item)
  {
    if(item==this.userCurrent)
    {
      return 'reply';
    }
    else

    {
      return 'reply-user';
    }
   }


  getClassUser(item,anh:any,file:any,video:any,content)
 {
   if(item==this.userCurrent&&(anh.length>0||file.length>0||video.length>0)&&(content==''||!content))
   {
     return 'curent';
   }
   else if(item!==this.userCurrent&&(anh.length>0||file.length>0||video.length>0)&&(content==''||!content))

   {
     return 'notcurent';
   }
   else
   {
     return ''
   }


 }
  getShowMoreChat(item)
  {
    if(item!==this.userCurrent)
    {
      return ' chat right';
    }
    else

    {
      return ' chat';
    }

  }
  getShowMoreChatLeft(item)
  {
    if(item==this.userCurrent)
    {
      return ' chat chatleft';
    }
    else

    {
      return ' chat chatright';
    }

  }
  getClassTime(item)
  {
    if(item===this.userCurrent)
    {
      return 'timesent';
    }
    else

    {
      return 'timereplies';
    }
  }
  getClassHiden(item,time:boolean)
  {

    if(item!==this.userCurrent&&!time)
    {
      return 'hidenmess diff';
    }
    else if(item!==this.userCurrent&&time)
    {
      return 'hidenmess timehidden';
    }
    else

    {
      return 'hidenmess';
    }
  }

  getClass(item,key,keyinsert)
  {
    if(key===false&&!keyinsert)
    {


    if(item===this.userCurrent)
    {
      return 'replies';
    }
    else

    {
      return 'sent';
    }
  }
  if(key)

  {
    return 'leaveGroup';
  }
  if(keyinsert)

  {
    return 'ImsertGroup';
  }
  }
  
  getNameUser(val) {
		if(val){
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return "";
	}
  getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0,1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}
  GetInforUserChatwith(IdGroup:number)
  {
   const sb= this.chatService.GetInforUserChatWith(IdGroup).subscribe(res=>{
     if(res)
     {


    this.GetTagNameisGroup(res.data[0].isGroup);
        this.listInfor=res.data;
        this.isGroup= this.listInfor[0].isGroup;
        this.TenGroup=this.listInfor[0].GroupName;
    this.thanhviennhomn=this.listInfor[0].ListMember.length;
        console.log('listInfor',this.listInfor)
        this.changeDetectorRefs.detectChanges();
      }
    })
    this._subscriptions.push(sb)
  }

  setIntrvl(){
    setInterval(() =>this.isloading=false,1000);
  }
  // ReconectGroup(){

  //   setInterval(() => this.messageService.connectToken(this.id_Group),1000);
  // }
  GetTagNameisGroup(isGroup)
  {
    if(isGroup)
    {
      this.tam=[
        {
          id:"All",note:"Nhắc cả nhóm ",value:"@All"
        }
      ]
    }
    else
    {
      this.tam=[];
    }




    const sb=this.chatService.GetTagNameGroup(this.id_Group).subscribe(res=>
      {
          this.lisTagGroup=this.tam.concat(res.data);
          this.listTagGroupAll=res.data;

          this.changeDetectorRefs.detectChanges();
      })
      this._subscriptions.push(sb)
  }

  GetImage(idgroup)
  {
    this.chatService.GetImage(idgroup).subscribe(res=>
        {
              this.LstImagePanel=res.data;
              this.changeDetectorRefs.detectChanges();
      })
  }
  ngOnInit(): void {

this.colornav=false;

    this.setIntrvl();
    const sb= this.route.params.subscribe(params => {

   
     this.pageSize=4;
  this.listReply=[];
      this.lstChatMess=[];
      this.list_image=[];
      this.AttachFileChat=[];
     this.messageContent='';
      this.id_Group =+params.id;
      this.id_Chat=+params.idchat;
      // this.presence.connectToken();
      this.GetListThamGiaCuocHop(this.id_Group);
      this.GetInforUserChatwith(this.id_Group);
      this.messageService.connectToken(this.id_Group);
        this.GetImage(this.id_Group)
        this.LoadFile(this.id_Group)
      // this.messageService.NhanMess();
      this.subscribeToEventsNewMess();
      this.subscribeToEventsLasttimeMess();


      this.subscribeToEvents();
      this.subscribeToEventsHidenmes();
      this.subscribeToEventsComposing();
        this.subscribeToEventsSendReaction();
        this.subscribeToEventsSeenMess();

        if(this.id_Chat)
        {
          this.LoadDataDetailDefaultMess(this.id_Group,this.id_Chat);

        }
        else
        {
          this.loadDataList();

        }
        this.searchControl.valueChanges
        .pipe()
        .subscribe(() => {
          this.filterBankGroups();
        });
     this.GetListReaction();


    //  this.viewPort.scrollToIndex(this.listMess.length, 'smooth');
   this.changeDetectorRefs.detectChanges();

      });
     this._subscriptions.push(sb)
  }


  //
  private subscribeToEventsHidenmes(): void {


    const sb=this.messageService.hidenmess.subscribe(res=>
      {
        if(res)
        {
          let item={
            IdGroup:this.id_Group,IdChat:res
          }
          this.messageService.MyChatHidden$.next(item);
          let index=this.listMess.findIndex(x=>x.IdChat==res);
            if(index>=0)
            {
              this.listMess[index].IsHidenAll=true;
              this.changeDetectorRefs.detectChanges();
            }

        }
      })



    }

    private subscribeToEventsLasttimeMess(): void {


  
      const sb=this.messageService.lasttimeMess.subscribe(res=>
        {
          
          if(res)
          {
            let index=this.listMess.findIndex(x=>x.IdChat==res.IdChat)
            if(index>=0&&res.IsFile)
            {
             
                this.listMess[index].isHidenTime=true;
                this.changeDetectorRefs.detectChanges();
              }
              else
              {
                  this.loadDataList();
              }
           
              // this.loadDataList();
          
            
            }
            //  this.loadDataList();

        })
   


      }

    private subscribeToEventsComposing(): void {


      this._ngZone.run(() => {

      const sb=this.messageService.ComposingMess.subscribe(res=>
        {
          if(res)
          {
            if(this.UserId!=res.UserId&&this.id_Group==res.IdGroup)
            {


            this.composing=true
            this.composingname=res.Name;
            setTimeout(() => {
              this.composing =false;
             }, 3000);
             this.changeDetectorRefs.detectChanges();
            }
          }
        })
        this._subscriptions.push(sb);
      })



      }

  private subscribeToEventsNewMess(): void {
    this.composing=false;

    const sb=this.messageService.Newmessage.subscribe(res=>
      {

//  console.log("MMMMMMMMMMM",res)
        if(this.listMess!==null)
        {
          if(this.listMess.length>0&&res.length>0)
          {



        let index=this.listMess.findIndex(x=>x.IdGroup==res[0].IdGroup);
        if(index>=0)
        {


        if(res.length>0)
        {

          this.id_chat_notify=res[0].IdChat

        let index=this.listMess.findIndex(x=>x.IdChat==res[0].IdChat)
        if(index>=0)
        {
          return;
        }
        else
        {


          this._ngZone.run(() => {
        if(res.length>0)
        {


          // this.lstChatMess.splice(0,1,res[0])

            this.listMess=[...this.listMess,res[0]];
            // this.lstChatMess==[];
            this.viewPort.scrollToIndex(this.listMess.length - 1,'smooth');
            if(this.listChoseTagGroup.length>0)
            {
              let notify=this.ItemNotifyMessenger(res[0].Content_mess,res[0].IdChat);
              this.chatService.publishNotifi(notify).subscribe(res=>
                {

                })
            }
            setTimeout(() => {
              this.viewPort.scrollTo({
                bottom: 0,
                behavior: 'auto',
              });
            }, 0);
            setTimeout(() => {
              this.viewPort.scrollTo({
                bottom: 0,
                behavior: 'auto',
              });
            }, 50);
            setTimeout(() => {
              this.viewPort.scrollTo({
                bottom: 0,
                behavior: 'auto',
              });
            }, 100);
            setTimeout(() => {
              this.viewPort.scrollTo({
                bottom: 0,
                behavior: 'auto',
              });
            }, 200);


            this.changeDetectorRefs.detectChanges();

      }
        else{
          return;
        }

       })
      }
    }
  }
}
}
else

{

  if(res.length>0)
  {



    this._ngZone.run(() => {




    this.lstChatMess.push(res[0])
   if(this.lstChatMess.length>0)
   {
    this.listMess=[];
    this.listMess=[...this.listMess,this.lstChatMess[this.lstChatMess.length-1]];
    this.lstChatMess==[];
    this.viewPort.scrollToIndex(this.listMess.length-1);
    this.changeDetectorRefs.detectChanges();
   }


})
}
else

{
  return;
}
}
    })

   this._subscriptions.push(sb);



  }

  private subscribeToEvents(): void {

    this._ngZone.run(() => {

    this.presence.onlineUsers$.subscribe(res=>
      {
         if(res)
         {

setTimeout(() => {

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
         
}, 1000);
      }
      })

    })

  }
  SetActive(item:any,active=true)
  {
    setTimeout(() => {



      let index=this.listInfor.findIndex(x=>x.UserId===item);

      if(index>=0)
      {

        this.listInfor[index].Active = active ? 1 : 0;

        this.changeDetectorRefs.detectChanges();
      }
    }, 500);

  }

// send mess


ItemMessenger(): Message {

  const item = new Message();


  item.Content_mess=this.messageContent.replace("<p><br></p>", "");
  item.UserName=this.userCurrent;
  item.IdGroup=this.id_Group;
  if(this.listReply.length>0)
  {
    if(this.listReply[0].Content_mess==="")
    {
      item.Note=this.listReply[0].InfoUser[0].Fullname+": Tệp đính kèm";
    }
    else
    {
      item.Note=this.listReply[0].InfoUser[0].Fullname+":"+this.listReply[0].Content_mess;
    }

  }
  else
  {
    item.Note="";
  }

  item.IsDelAll=false;
  item.IsVideoFile=this.url?true:false;
  item.Attachment=this.AttachFileChat.slice();

  return item
}

NotifyTagName(content:string)
{

      for(let i=0;i<  this.lstTagName.length;i++)
      {
        if(this.lstTagName[i]=="All")
        {
          this.listTagGroupAll.forEach(element => {
            this.listChoseTagGroup.push(element.id);
          });

        }
        else
        {



    let giatri= content.replace('/',"").indexOf(`data-id="${this.lstTagName[i]}`);
    console.log("Check giá tri",giatri)
    if(giatri>-1)
    {
      this.listChoseTagGroup.push(this.lstTagName[i]);
    }
  }
  }
  console.log("listChoseTagGroup",this.listChoseTagGroup)
}

ItemNotifyMessenger(content:string,idchat:number): NotifyMessage {

  const item = new NotifyMessage();
  item.TenGroup=this.TenGroup;
  item.Avatar=this.Avataruser;
  item.IdChat=idchat;
  item.IdGroup=this.id_Group;
  item.Content=content;
  item.ListTagname=this.listChoseTagGroup;
  return item
}

sendMessage() {
  // debugger
  this.txttam="";

   this.messageContent=this.messageContent.replace("<p></p>", "");

  this.NotifyTagName(this.messageContent);
  if((this.messageContent&&this.messageContent!=""&&this.messageContent!="<p><br></p>"&&this.messageContent.length>0)||this.AttachFileChat.length>0)
  {
    this.isloading=false;
  const data=this.auth.getAuthFromLocalStorage();

     var _token =data.access_token;
  let  item =this.ItemMessenger();



    this.messageService.sendMessage(_token,item,this.id_Group).then(() => {
      // this.messageContent="";
      // document.getElementById('content').textContent = '';
      this.listChoseTagGroup=[]
      this.lstTagName=[];
      this.AttachFileChat=[];
      this.list_file=[];
      this.listFileChat=[];
      this.list_image=[];
      this.listReply=[];
      this.myFilesVideo=[];
      this.url="";
      if(this.id_Chat)
      {
        this.router.navigate(['Chat/Messages/'+this.id_Group+'/null']);
      }

      // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 0);
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 50);
     this.messageForm.reset();

    })




}



}




items: GalleryItem[] = [];
@ViewChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any> | undefined;

loadlightbox(id: any) {
  let index = this.listMess.findIndex((x) => x.IdChat == id);

  this.items = this.listMess[index].Attachment.map((item) => {
    return {
      type: 'imageViewer',
      data: {
        src: item.hinhanh,
        thumb: item.hinhanh,
      },
    };
  });

  /** Lightbox Example */

  // Get a lightbox gallery ref
  const lightboxRef = this.gallery.ref('lightbox');

  // Add custom gallery config to the lightbox (optional)
  lightboxRef.setConfig({
    imageSize: ImageSize.Cover,
    thumbPosition: ThumbnailsPosition.Bottom,
    itemTemplate: this.itemTemplate,
    gestures: false,
  });

  // Load items into the lightbox gallery ref
  let ob = this.items;
  lightboxRef.load(this.items);
  this.changeDetectorRefs.detectChanges();
}
    DisplayTime(item)
    {
      let currentDate = new Date(new Date().toUTCString());

      let yearcr = currentDate.getFullYear() ;
      let monthcr = currentDate.getMonth() ;
      let daycr = currentDate.getDate() ;



        let d=item+'Z'

      let date = new Date(d);


      let year= date.getFullYear() ;
      let month= date.getMonth() ;
      let day = date.getDate() ;
      let hour = date.getHours();
     let minute = date.getMinutes();
      if(year==yearcr&&monthcr==month&&daycr==day)
      {
        return hour+':'+minute+' Hôm nay'
      }
      else if (year==yearcr&&monthcr==month&&daycr-day==1)
      {
        return hour+':'+minute+' Hôm qua'
      }
      else
      {
        var tz =moment.tz.guess()

        let d=item+'Z'
        var dec = moment(d);
        return  dec.tz(tz).format(' HH:mm DD/MM/YYYY');

      }

    }
   urlify(item) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return item.replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })

    }



  onPaste(event: any) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let blob = null;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    // load image if there is a pasted image
    if (blob !== null) {
      let base64Str: any;
      var file_name=blob;
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        // console.log(evt.target.result); // data url!

        this.list_image.push(evt.target.result);
        var metaIdx = this.list_image[0].indexOf(';base64,');
       base64Str =  this.list_image[0].substr(metaIdx + 8);
     this.AttachFileChat.push({ filename: file_name.name,type:file_name.type,size:file_name.size,strBase64: base64Str });
     this.changeDetectorRefs.detectChanges();
    };
      reader.readAsDataURL(blob);
    }
  }
	GetListReaction()
		{
			this.chatService.getlist_Reaction().subscribe(res => {
				this.list_reaction=res.data;
				this.changeDetectorRefs.detectChanges();

			})
		}

    SendReaction(idchat:number,type:number)
    {
      const dt=this.auth.getAuthFromLocalStorage();
      this.messageService.ReactionMessage(dt.access_token,this.id_Group,idchat,type);
    }


    private subscribeToEventsSendReaction(): void {


      this._ngZone.run(() => {

      const sb=this.messageService.reaction.subscribe(res=>
        {
          // console.log("REACTION",res)
          if(res)
          {
                let index=this.listMess.findIndex(x=>x.IdChat==res.data[0].IdChat);
                  if(index>=0)
                  {
                    this.listMess[index].ReactionChat=res.data[0].ReactionChat.slice();
                    if(res.data[0].ReactionUser.CreateBy==this.UserId)
                    {
                      this.listMess[index].ReactionUser=Object.assign(res.data[0].ReactionUser);
                    }

                    this.changeDetectorRefs.detectChanges();
                  }
          }
        })
        this._subscriptions.push(sb);
      })



      }


      private subscribeToEventsSeenMess(): void {


        this._ngZone.run(() => {

        const sb=this.messageService.seenmess.subscribe(res=>
          {
            if(res&&res.status==1)
            {
             
              if(res.data[0].IdGroup===this.id_Group&&res.data[0].UserName!==this.userCurrent)
              {
                
                 
                  if(!this.isGroup)
                  {
                    this.listMess[this.listMess.length-1].Seen.splice(0,1,res.data[0]);
                  }
                  else
                  {
                    // let vitri= this.listMess[this.listMess.length-1].Seen
                    // .findIndex(x=>x.username==res.data[0].UserName)
                    // console.log("AAAA",vitri)
                    // if(vitri<0)
                    // {
                      this.listMess[this.listMess.length-1].Seen=res.data;

                      this.changeDetectorRefs.detectChanges();
                    // }
                  
                  }
                
              }

              // setTimeout(() => {
              //   this.active_SeenMess=false;
              // }, 600000);


              // if(res.IdGroup)
                  // let index=this.listMess.findIndex(x=>x.IdChat==res.data[0].IdChat);
                  //   if(index>=0)
                  //   {
                  //     this.listMess[index].ReactionChat=res.data[0].ReactionChat.slice();
                  //     this.listMess[index].ReactionUser=Object.assign(res.data[0].ReactionUser);
                  //     this.changeDetectorRefs.detectChanges();
                  //   }
            }
          })
          this._subscriptions.push(sb);
        })


        }

InsertRectionChat(idchat:number,type:number)
{

this.SendReaction(idchat,type);

}
toggleWithGreeting(idChat:number,type:number) {


  this.chatService.GetUserReaction(idChat,type).subscribe
      (res=>
        {
          this.listreaction=res.data;
          this.changeDetectorRefs.detectChanges();
        })

  }
  ItemSeenMessenger(): SeenMessModel {
    const item = new SeenMessModel();
   item.Avatar=this.Avataruser;
   item.CreatedBy=this.UserId;
   item.CustomerId=this.customerID;
   item.Fullname=this.Fullname;
   item.id_chat=this.listMess[this.listMess.length-1].IdChat;
   item.username=this.userCurrent;
      item.IdGroup=this.id_Group;
  
    return item
  }

  focusFunction = (event) =>{
    
    if(event.oldRange == null&&this.listMess[this.listMess.length-1].UserName!=this.userCurrent){
     
      let item =this.ItemSeenMessenger();

     this.messageService.SeenMessage(item);
    }
   
  }
 
  DeleteReply()
  {
    this.listReply=[];
  }


	ChuyenTiepMess(item) {
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(ShareMessageComponent, {
  width:'600px',
  data: { item },


    });
  dialogRef.afterClosed().subscribe(res => {


          if(res)
    {
    //   const data = this.auth.getAuthFromLocalStorage();
    // this.presence.NewGroup(data.access_token,res[0],res[0])

      this.changeDetectorRefs.detectChanges();
    }
          })

    }


  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  modules = {
    toolbar: false,

    mention: {
      mentionListClass: "ql-mention-list mat-elevation-z8",
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      showDenotationChar: false,
      // mentionDenotationChars: ["@", "#"],
      spaceAfterInsert: false,

      onSelect: (item, insertItem) => {


        let index=this.lstTagName.findIndex(x=>x==item.id);
        if(index<0)
        {
          this.lstTagName.push(item.id)
        }





       console.log("IIIIIIIIII", this.lstTagName)
        const editor = this.editor.quillEditor;
        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, "", "user");
      },
      renderItem : function (item, searchTerm)
      {

        if(item.Avatar)
        {



        return `
      <div >

      <img  style="    width: 30px;
      height: 30px;
      border-radius: 50px;" src="${item.Avatar}">
      ${item.value}



      </div>`;
    }
    else if(item.id!=="All")
    {
      return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:${item.BgColor}">
        </div>
        <span style=" position: absolute;     left: 20px;  color: white;">${item.value.slice(0,1)}</span>
        <span style=" padding-left: 5px;">  ${item.value}</span>

      </div>`;
    }
    else
    {
      return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:#F3D79F">
        </div>
        <span style=" position: absolute;     left: 20px;  color: white;">@</span>
        <span style=" padding-left: 5px;">${item.note}</span>
        <span style=" padding-left: 5px;">  ${item.value}</span>

      </div>`;
    }
  },
      source: (searchTerm, renderItem) => {
         const values = this.lisTagGroup;


        if (searchTerm.length === 0) {
          renderItem(values, searchTerm);

        } else {
          const matches = [];

          values.forEach(entry => {
            if (
              entry.value.toLowerCase().replace(/\s/g, '').indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderItem(matches, searchTerm)

        }
      }
    }
  };

// begin call video



  CallVideoDialog(code,callName,img,bg) {
    var dl={isGroup:this.isGroup,UserName:this.userCurrent,BG:bg,Avatar:img,PeopleNameCall:callName,status:code,idGroup:this.id_Group,keyid:null};
    const dialogRef = this.dialog.open(CallVideoComponent, {
//  width:'800px',
//    height:'800px',
  data: {dl },
  disableClose: true

    });
  dialogRef.afterClosed().subscribe(res => {

    console.log("Tắt Cuộc gọi..gửi tin nhắn ",res)
          if(res)
    {





        const item = new Message();
if(res.timecall.replace(/""/,"")=='"0:0"')
{
  res.status=='call'?item.Content_mess="Đã lỡ cuộc gọi": item.Content_mess="Đã lỡ video call";
}
else{
  res.status=='call'?item.Content_mess="Cuộc gọi thoại": item.Content_mess="Video call";
}
      


        item.UserName=res.UserName;
        item.IdGroup=this.id_Group;
        item.isCall=true;
          item.Note=res.timecall.replace(/""/,"");
        item.IsDelAll=false;
        item.IsVideoFile=this.url?true:false;
        item.Attachment=this.AttachFileChat.slice();

        const data=this.auth.getAuthFromLocalStorage();

        var _token =data.access_token;
        this.messageService.sendMessage(_token,item,this.id_Group).then(() => {
          // this.messageContent="";
          // document.getElementById('content').textContent = '';
          this.listChoseTagGroup=[]
          this.lstTagName=[];
          this.AttachFileChat=[];
          this.list_file=[];
          this.listFileChat=[];
          this.list_image=[];
          this.listReply=[];
          this.myFilesVideo=[];
          this.url="";
          // if(this.id_Chat)
          // {
          //   this.router.navigate(['Chat/Messages/'+this.id_Group+'/null']);
          // }

          // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 0);
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 50);
    })
    }
          })

    }
  screenShare(): void {
    this.shareScreen();
  }

  private shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        // cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        // noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }


  ngOnDestroy() {
    console.log('%c DetailDestroy ', 'background: red; color: #bada55');
     if(this._subscriptions)
     {
       this._subscriptions.forEach((sb) => sb.unsubscribe());
     }
    //  this.messageService.Newmessage.unsubscribe();
   }

   loadlightboxImage() {


    this.items = this.LstImagePanel.map((item) => {
      return {
        type: 'imageViewer',
        data: {
          src: item.hinhanh,
          thumb: item.hinhanh,
        },
      };
    });

    /** Lightbox Example */

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Bottom,
      itemTemplate: this.itemTemplate,
      gestures: false,
    });

    // Load items into the lightbox gallery ref
    let ob = this.items;
    lightboxRef.load(this.items);
    this.changeDetectorRefs.detectChanges();
  }
Back()
{
  this.allfile=false;
}
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  selectTab(tabId: number) {
    this.allfile=true;
   setTimeout(() => {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;

    }
   }, 100);

  }

  public filteredFile: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public searchControl: FormControl = new FormControl();


  LoadFile(idgroup)
  {
    this.chatService.GetAllFile(idgroup)
    .subscribe(res=>
      {
        this.LstFilePanel=res.data;
        this.filteredFile.next(this.LstFilePanel.slice());
        this.changeDetectorRefs.detectChanges();
      })
  }

protected filterBankGroups() {
  if (!this.list_file) {
    return;
  }
  // get the search keyword
  let search = this.searchControl.value;
  // const bankGroupsCopy = this.copyGroups(this.list_group);
  if (!search) {
    this.filteredFile.next(this.LstFilePanel.slice());

  } else {
    search = search.toLowerCase();
  }

    this.filteredFile.next(
      this.LstFilePanel.filter(bank => bank.filename.toLowerCase().indexOf(search) > -1)
    );
  }

  toogleNav(nav: any) {
 
    if (nav.opened) {
      this.colornav=true
      nav.close()
    } else {
      this.colornav=false
      nav.open();
    }
  }
}


