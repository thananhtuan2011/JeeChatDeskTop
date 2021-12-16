import { delay } from 'rxjs/operators';
import { PresenceService } from 'src/app/services/presence.service';
import { SoundService } from './../../../services/sound.service';
import { AuthService } from './../../../auth/_services/auth.service';
import { MessageService } from './../../../services/message.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import Peer from 'peerjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronIpcService } from 'src/app/services/electron-ipc.service';

@Component({
  selector: 'app-call-video',
  templateUrl: './call-video.component.html',
  styleUrls: ['./call-video.component.scss']
})
export class CallVideoComponent implements OnInit {
isGroup:boolean;
  acticall:boolean=true;
  status:string;
  acticlose:boolean=false;
  error:boolean=false;
  Fullname:string;
  Avatar:string;
  CallPeople:string;
  AvatarSend:string;
  NameCall:string;
  private peer: Peer;
  interval:any;
  peerIdShare: string;
  peerId: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  userCurrent:string
  BgColor:string;
  offmic:boolean=false;
  offvideo:boolean=false
  chatgroup:number;
  BgColorSend:string;
  mm = 0;
  ss = 0;
  ms = 0;
  timerId:any = 0;
  isRunning = false;
 configService:any="stun:stun.l.google.com:19320";
  constructor(
    private dialogRef:MatDialogRef<CallVideoComponent>,
    private messageService:MessageService,
    private auth:AuthService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private soundservice:SoundService,
    private presence:PresenceService,
    private electron_services:ElectronIpcService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private _platform: Object
  ) {
     this.chatgroup=Number.parseInt(this.electron_services.getIdGroup());
    // this.peer = new Peer()
    // ;hihi tuan
   
    const dt=this.auth.getAuthFromLocalStorage();
    this.userCurrent=dt.user.username;
    this.Fullname=dt['user']['customData']['personalInfo']['Fullname'];
    this.Avatar=dt['user']['customData']['personalInfo']['Avatar'];
    this.BgColor=dt['user']['customData']['personalInfo']['BgColor'];
    this.peer = new Peer( {
      config: {
        'iceServers': [{
          urls:"stun:stun.l.google.com:19320",          
        },
        {
          urls:'turn:numb.viagenie.ca',
          username:'webrtc@live.com',
          credential:'muazkh'
        }
      ]
      }
    });
    
   }
   @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;

   private getPeerId = () => {
    this.peer.on('open', (id) => {
      this.peerId = id;
      console.log("peerId", this.peerId)
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        this.lazyStream = stream;

        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });
      }).catch(err => {
          // phân lỗi không thể mở video
          this.error=true;
        console.log(err + 'Unable to get media');
      });
    });

  }
  SendCallVideo(id:any,isGroup:boolean)
  {
    this.messageService.sendCallVideo(isGroup,this.data.dl.status,this.data.dl.idGroup
      ,this.userCurrent,this.Fullname,this.Avatar,this.BgColor,id).catch(err => { console.log(err)

      this.messageService.connectToken(this.data.dl.idGroup);
      setTimeout(() => {
        this.messageService.sendCallVideo(isGroup,this.data.dl.status,this.data.dl.idGroup
          ,this.userCurrent,this.Fullname,this.Avatar,this.BgColor,id)
      }, 1000);


    });;

  }
  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
  clickHandlerTime() {

      // Stop => Running
    this.timerId = setInterval(() => {
        this.ms++;

        if (this.ms >= 100) {
          this.ss++;
          this.ms = 0;
        }
        if (this.ss >= 60) {
          this.mm++;
          this.ss = 0
        }
      }, 10);

    // this.isRunning = !this.isRunning;
  }
  TimeCall()

  {
    this.presence.TimeCallVideo(this.data.dl.idGroup);
  }
  ChapNhan()

  {

    clearInterval(this.interval);
    this.TimeCall();
    this.acticall=true;
if(this.data.dl.status=='video')
{
  this.callPeer(this.data.dl.keyid);
}
else
{
  this.callPeervoid(this.data.dl.keyid);
}

    // if(this.data.dl.status=='video')
    // {

    // }
    // else
    // {
    //   this.acticall=true;
    //   clearInterval(this.interval);
    //   this.callPeervoid(this.data.dl.keyid);
    // }


    this.changeDetectorRefs.detectChanges();
  }


  BackCall() {

this.acticlose=false;

setTimeout(() => {
  this.SendCallVideo(this.peerId,this.isGroup)
}, 3000);
    }
  private EventSubcibeCloseCallVideo(): void {

    this.presence.ClosevideoMess.subscribe(res=>
      {
      if(res)
      {
console.log("TTTTTTT",res)
        this.status=this.data.dl.status;

        if(this.data.dl.idGroup==res.IdGroup)
        {
          // setTimeout(() => {
          //   this.CloseCall();
          // }, 1000);
          this.acticlose=true;
          clearInterval(this.interval);
         this.changeDetectorRefs.detectChanges();
        }
      }

      })

  }


  private EventSubcibeTimeCallVideo(): void {

    this.presence.timeCallvideoMess.subscribe(res=>
      {
      if(res&&res.IdGroup==this.data.dl.idGroup)
      {

      this.clickHandlerTime();
      }

      })

  }

// closeCallVideoDialog() {
//   const dialogRef = this.dialog.open(CloseCallComponent, {
// // width:'800px',
// // height:'auto',
// disableClose: true

//   });
//   dialogRef.afterClosed().subscribe(res => {

//     if(res)
// {

// }
//     })

// }
  ngOnInit(): void {
    this.presence.ClosevideoMess.next(undefined)
    this.acticlose=false;
    this.isGroup=this.data.dl.isGroup;
    this.acticall=true;
    this.AvatarSend=this.data.dl.Avatar;
this.status=this.data.dl.status
this.NameCall=this.data.dl.Name;
this.BgColorSend=this.data.dl.BG;
this.CallPeople=this.data.dl.PeopleNameCall;
    console.log("Data",this.data)

    console.log("dkdđ",  this.data.dl.idGroup)

    this.getPeerId();
    if(this.data.dl.keyid==null&&this.data.dl.UserName==this.userCurrent)
    {
      setTimeout(() => {
        this.SendCallVideo(this.peerId,this.isGroup);
        // this.clickHandlerTime();
      }, 3000);
    }
    else
    {
      this.acticall=false;
      this.soundservice.playAudiocallVideo();
      this.interval=setInterval(() => {

              this.soundservice.playAudiocallVideo();

            }, 10000);
            // this.changeDetectorRefs.detectChanges();
    }
    // setTimeout(() => {
    //
    // }, 3000);
    this.EventSubcibeCloseCallVideo();
    this.EventSubcibeTimeCallVideo();

  }



  private callPeer(id: string): void {
console.log("IDDDPEAR",id)
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;


      const call = this.peer.call(id, stream);
      call.on('stream', (remoteStream) => {
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);

            console.log("  this.peerList.",  this.peerList)

        }
      });
    }).catch(err => {
      this.error=true;

      console.log(err + 'Unable to connect');
    });
  }

  private callPeervoid(id: string): void {

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;


      const call = this.peer.call(id, stream);
      call.on('stream', (remoteStream) => {
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);



        }
      });
    }).catch(err => {
      this.error=true;

      console.log(err + 'Unable to connect');
    });
  }


  private streamRemoteVideo(stream: any): void {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    document.getElementById('remote-video').append(video);

  }
  Disconnect()
  {
    clearInterval(this.interval);
    // if(this.lazyStream)
    // {
      try{

     
 this.lazyStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }catch
  {
  }

    // }


    setTimeout(() => {
      this.presence.CloseCallVideo(this.data.dl.idGroup,this.userCurrent);
    }, 3010);


  //   let time=
  //   {
  //     time:  this.mm+this.ss+this.ms

  //   }
  //   this.data.dl.push(time);
  // console.log("Push mảng",this.data.dl)

    this.CloseDia(this.data.dl)
    this.changeDetectorRefs.detectChanges();



  }
  CloseCall()
  {
    if(this.lazyStream)
    {
 this.lazyStream.getTracks().forEach(function(track) {
      track.stop();
    });


    }

      // this.dialogRef.close();

      this.CloseDia(this.data.dl)
  }

  CloseDia(data = undefined)
  {
    let time=(this.mm+":"+this.ss)
    let schuoi=JSON.stringify(time)
    // console.log("Puschuoish schuoi",schuoi)
    let timec=
    {
      timecall:schuoi
    }
    let dl= Object.assign(data, timec);
    console.log("Push mảng",dl)
      this.dialogRef.close(dl);
  }
  Close()
  {
    if(this.lazyStream)
    {
 this.lazyStream.getTracks().forEach(function(track) {
      track.stop();
    });

    }
    this.presence.ClosevideoMess.next(undefined)
    clearInterval(this.interval);
    this.CloseDia(this.data.dl)
    // this.dialogRef.close();
  }
  screenShare(): void {
    this.shareScreen();
  }
  private shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
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

  OffMic()
  {
    if( this.offmic)
    {
      this.offmic=false;
      if(this.lazyStream)
      {
      if(this.lazyStream.getAudioTracks()[0]){
        this.lazyStream.getAudioTracks()[0].enabled = true;
      }
    }
    }
    else
    {
      this.offmic=true;
      if(this.lazyStream)
      {
      if(this.lazyStream.getAudioTracks()[0]){
        this.lazyStream.getAudioTracks()[0].enabled = false;
      }
    }
    }
    
    this.changeDetectorRefs.detectChanges();
  }

  OffVideo()
  {
    if(this.offvideo)
    {
      this.offvideo=false;
      if(this.lazyStream)
      {
        
        if(this.lazyStream.getVideoTracks()[0]){
          this.lazyStream.getVideoTracks()[0].enabled =true;
        }
      }
     
    
    }
    else
    {
      this.offvideo=true;
      if(this.lazyStream)
      {

      if(this.lazyStream.getVideoTracks()[0]){
        this.lazyStream.getVideoTracks()[0].enabled =false;
      }
    }
    }
    
    this.changeDetectorRefs.detectChanges();
  }
}
