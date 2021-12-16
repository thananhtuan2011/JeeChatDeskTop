import { AuthService } from './../auth/_services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl+'/api';
  private currentUserSource = new ReplaySubject<any>(1);
  currentUser$ = this.currentUserSource.asObservable();
  public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(private http: HttpClient, private presence: PresenceService) { }
private auth:AuthService
  // login(model: any){
  //   return this.http.post(this.baseUrl+'Account/login', model).pipe(
  //     map((res:User)=>{
  //       const user = res;
  //       if(user){
  //         // this.setCurrentUser(user);
  //         this.presence.createHubConnection(user);
  //       }
  //     })
  //   )
  // }

  setCurrentUser(user: any){
    if(user){
     
      // const roles = this.getDecodedToken(user.token).role;//copy token to jwt.io see .role   
      // Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
      this.currentUserSource.next(user.user.username); 
    }      
  }

  public getAuthFromLocalStorage(): any {
    // try {
    //   const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    //   return authData;
    // } catch (error) {
    //   console.error(error);
    //   return undefined;
    // }
    return this.auth.getAuthFromLocalStorage();
  }
  getHttpHeaders() {
    
    const data = this.getAuthFromLocalStorage();
    
    // console.log('auth.token',auth.access_token)
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+data.access_token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }
  // GetContactChatUser()
  // {
  //   const url =this.baseUrl+'/chat/Get_Contact_Chat'
  //   const httpHeader = this.getHttpHeaders();
  //   return this.http.get<any>(url,{ headers: httpHeader});
  // }


  // UpdateUnRead(IdGroup:number,key:string)
  // {
  //   const url =this.baseUrl+`/chat/UpdateDataUnread?IdGroup=${IdGroup}&key=${key}`
  //   const httpHeader = this.getHttpHeaders();
  //   return this.http.post<any>(url,null,{ headers: httpHeader});
  // }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('chatboxusers');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  // register(model:any){
  //   return this.http.post(this.baseUrl+'Account/register', model).pipe(
  //     map((res:User)=>{
  //       if(res){
  //         // this.setCurrentUser(res);
  //         this.presence.createHubConnection(res);
  //       }
  //       return res;
  //     })
  //   )
  // }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  // getMember(username:string){//token duoc goi trong jwt.interceptor    
  //   return this.http.get<Member>(this.baseUrl+'user/' + username);
  // }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photoId);
  }
}
