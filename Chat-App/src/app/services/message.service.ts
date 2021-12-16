import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/_services/auth.service';
import { Member } from '../ChatAppModule/models/member';
import { Message } from '../ChatAppModule/models/message';
import { SeenMessModel } from '../ChatAppModule/models/SeenMess';
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(environment.hubUrl+'message', {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//   .build();

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl+'/api';
  hubUrl = environment.hubUrl+'/hubs';
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private seenMessageSource = new ReplaySubject<string>(1);
  seenMessage$ = this.seenMessageSource.asObservable();
  messageReceived: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  // public messageReceived: EventEmitter<any>;///tin nhan ca nhan
  public MyChatHidden$ = new BehaviorSubject<any>(null);
  public Newmessage = new BehaviorSubject<Message[]>([]);
  Newmessage$ = this.Newmessage.asObservable();
  // constructor(private http: HttpClient) { }



  // private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<Member[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  private messageUsernameSource = new ReplaySubject<Member>(1);
  messageUsername$ = this.messageUsernameSource.asObservable();


  public hidenmess = new BehaviorSubject<any>(undefined);
  hidenmess$ = this.hidenmess.asObservable();

  public reaction = new BehaviorSubject<any>(undefined);
  reaction$ = this.reaction.asObservable();

  public seenmess = new BehaviorSubject<any>(undefined);
  seenmess$ = this.seenmess.asObservable();





  public ComposingMess = new BehaviorSubject<any>(undefined);
  ComposingMess$ = this.ComposingMess.asObservable();


  public lasttimeMess = new BehaviorSubject<any>(undefined);
  lastimeMess$ = this.lasttimeMess.asObservable();
  constructor(
    private auth:AuthService

    ) {

    //   connection.onclose(()=>{
    //     setTimeout(r=>{
    //       this.reconnectToken();
    //     },5000);
    //  })
    }


  connectToken(idgroup){
    const data=this.auth.getAuthFromLocalStorage();
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+'/message?IdGroup='+idgroup+'&token='+data.access_token
    , {
     
    }).withAutomaticReconnect()
        .build()

        this.hubConnection.start().catch(err => console.log(err));

  //     const data=this.auth.getAuthFromLocalStorage();

  //        var _token =`Bearer ${data.access_token}`
  //        localStorage.setItem('chatGroup', JSON.stringify(idgroup));
  // const chatgroup=localStorage.getItem('chatGroup');
        //  this.hubConnection .invoke("onConnectedTokenAsync", _token,Number.parseInt(chatgroup));
        //  const chatgroup=localStorage.getItem('chatGroup');
        //  this.hubConnection .invoke("onConnectedTokenAsync", _token,Number.parseInt(chatgroup));
        // if(idGroup)
        // {
        //   this.hubConnection .invoke("onConnectedTokenAsync", _token,idGroup);
        // }
        // else
        // {
        //   const chatgroup=localStorage.getItem('chatGroup');
        //   this.hubConnection .invoke("onConnectedTokenAsync", _token,chatgroup);
        // }




          // load mess khi
         this.hubConnection.on('ReceiveMessageThread', messages => {
              console.log('ReceiveMessageThread',messages)
              const reversed = messages.reverse();
              this.messageThreadSource.next(reversed);
            })

            // this.hubConnection.on('SeenMessageReceived', username => {
            //   this.seenMessageSource.next(username);
            // })
            this.hubConnection.on('HidenMessage', data => {
              this.hidenmess.next(data);
            })
            this.hubConnection.on('ReactionMessage', data => {
              this.reaction.next(data);
            })

            this.hubConnection.on('SeenMessage', data => {
              this.seenmess.next(data);
            })
            this.hubConnection.on('Composing', data => {
              // console.log('Composing',data)
              this.ComposingMess.next(data);
            })

            this.hubConnection.on('LastTimeMessage', data => {
              // console.log('LastTimeMessageTTTTTTTTTTTTT',data)
              this.lasttimeMess.next(data);
            })
            this.hubConnection.on('NewMessage', message => {
              //  console.log('mesenger',message)
              this.messageThread$.pipe(take(1)).subscribe(messages => {
                this.messageThreadSource.next([...messages, message[0]])
                 this.Newmessage.next(message);
              })
            })
    



}




stopHubConnection() {
  this.hubConnection .stop().catch(error => console.log(error));
}


reconnectToken(): void {
  var _token = '',_idUser="0";
  const data=this.auth.getAuthFromLocalStorage();
  let infoTokenCon = { "Token": _token,"UserID":_idUser};
  this.hubConnection .start().then((data: any) => {
      console.log('Connect with ID',data);
      this.hubConnection .invoke("ReconnectToken", JSON.stringify(infoTokenCon)).then(()=>{
      });
    }).catch((error: any) => {
     console.log('Could not ReconnectToken! ',error);
    });
 ///  console.log('Connect with ID',this.proxy.id);
  }



  async sendMessage(token:string,item:any,IdGroup:number){
    return  this.hubConnection.invoke('SendMessage',token,item,IdGroup)
      .catch(error => console.log(error));
  }
  async sendCallVideo(isGroup:boolean,statuscode:string,IdGroup:number,usernmae:string,fullname:string,img :string,bg:string,keyid:string){
    return  this.hubConnection.invoke('CallVideo',isGroup,statuscode,IdGroup,usernmae,fullname,img,bg,keyid)
      .catch(error => console.log(error));
  }

  async HidenMessage(token:string,IdChat:number,IdGroup:number){
    return  this.hubConnection.invoke('DeleteMessage',token,IdChat,IdGroup)
      .catch(error => console.log(error));
  }
  async  Composing(token:string,IdGroup:number){
    return  this.hubConnection.invoke('ComposingMessage',token,IdGroup)
      .catch(error => console.log(error));
  }
  async  ReactionMessage(token:string,IdGroup:number,idchat:number,type){
    return  this.hubConnection.invoke('ReactionMessage',token,IdGroup,idchat,type)
      .catch(error => console.log(error));
  }
  async  SeenMessage(item:SeenMessModel){
    return  this.hubConnection.invoke('SeenMessage',item)
      .catch(error => console.log(error));
  }


  // async seenMessage(recipientUsername: string){
  //   return this.hubConnection.invoke('SeenMessage', recipientUsername)
  //     .catch(error => console.log(error));
  // }
}
