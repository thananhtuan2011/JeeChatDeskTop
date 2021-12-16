import { ChatService } from './../../../services/chat.service';
import { AuthService } from './../../../auth/_services/auth.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/ChatAppModule/models/member';
import { AccountService } from '../../../services/account.service';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  providers: [MessageService]//separate services independently for every component
})
export class ChatBoxComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() user: any;
  messageContent: string;
  //@ViewChild('ChatBox', { static: true }) element: ElementRef;
  userCurrent: string;
  @Input() right: number;
  @Output() removeChatBox = new EventEmitter();
  @Output() activedChatBoxEvent = new EventEmitter();
  isCollapsed = false;
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollMeChat', { static: false }) scrollMeChat: ElementRef;
  constructor(private accountService: AccountService, public messageService: MessageService,
    private auth:AuthService,
    private chatService:ChatService,
    private ref: ChangeDetectorRef,
    private _ngZone:NgZone,
    ) {
const dt=this.auth.getAuthFromLocalStorage();
this.userCurrent=dt.user.username
    // this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.userCurrent = user);
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event,item) {

    if (event.srcElement.scrollTop == 0) {
      // alert(item)
      // this.getIdTopChat();
      // if (!this.IsMinIdChat) {
      //  /// console.debug("Scroll to Top with page", this.idChatFrom);
      //   this.loadMoreMessChatFromId(this.idChatFrom);
      // }

    }

  }

  ngOnInit(): void {
    this.scrollToBottom();
    //  this.messageService.connectToken(this.user.user.IdGroup);
    
  }

  ngAfterViewInit() {
    var chatBox = document.getElementById(this.user.user.IdGroup);
    chatBox.style.right = this.right + "px";
  }

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
   
    /* let pos = event.target.scrollTop + event.target.offsetHeight;
    let max = event.target.scrollHeight;
    pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos == max) {
      this.messageService.seenMessage(this.user.userName);
    } */
  }

  
  ItemMessenger(): Message {
		const item = new Message();
    item.Content_mess=this.messageContent;
    item.UserName=this.userCurrent;
    item.IdGroup=this.user.user.IdGroup;

    return item
  }


  sendMessage() {
    if(this.messageContent.length>=0)
    {

    
    const data=this.auth.getAuthFromLocalStorage();

       var _token =data.access_token;
    let  item =this.ItemMessenger();
    this.messageService.sendMessage(_token,item,this.user.user.IdGroup).then(() => {
     
      this.messageForm.reset();
    })
}
  }

  closeBoxChat() {
    this.removeChatBox.emit(this.user.user.IdGroup);
  }

  onFocusEvent(event: any) {
    //console.log(event.target.value);
    // this.activedChatBox();
  }
  
  activedChatBox() {
    this.activedChatBoxEvent.emit(this.user.user.IdGroup)
  }
}
