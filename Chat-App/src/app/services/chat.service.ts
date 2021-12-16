import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PresenceService } from './presence.service';
import { AuthService } from '../auth/_services/auth.service';
import { QueryParamsModelNewLazy, QueryResultsModel } from '../ChatAppModule/models/pagram';
import { NotifyMessage, UserModelGroup } from '../ChatAppModule/models/NotifyMess';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  public reload$ = new BehaviorSubject<boolean>(false);
  public InforUserChatWith$ = new BehaviorSubject<any>([]);
  public notify$ = new BehaviorSubject<any>(null);
  get isLoading$() {
    return this._isLoading$.asObservable();
  }




  private unreadmessageSource = new ReplaySubject<number>(1);
  countUnreadmessage$ = this.unreadmessageSource.asObservable();

  baseUrl = environment.apiUrl+'/api';
  private currentUserSource = new ReplaySubject<any>(1);
  currentUser$ = this.currentUserSource.asObservable();
  public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(private http: HttpClient, private presence: PresenceService, private auth:AuthService)


  { }


  setCurrentUser(user: any){
    if(user){


      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
      this.currentUserSource.next(user.user.username);
    }
  }


  public getAuthFromLocalStorage(): any {

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
  getHttpHeaderFiles() {

    const data = this.getAuthFromLocalStorage();
    let result = new HttpHeaders({

      'Authorization':'Bearer '+data.access_token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }
  GetContactChatUser()
  {
    const url =this.baseUrl+'/chat/Get_Contact_Chat'
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }


  
  GetUserReaction(idchat:number,type:number)
  {
    const url =this.baseUrl+`/chat/GetUserReaction?idchat=${idchat}&type=${type}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }




  GetTaoUserTaoCuocHop(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetTaoUserTaoCuocHop?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetAllFile(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetAllFile?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetImage(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetImage?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetTagNameGroup(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetTagNameisGroup?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  InsertReaction(idchat:number,IdGroup:number,type:number)
  {
    const url =this.baseUrl+`/chat/InsertReactionChat?idchat=${idchat}&IdGroup=${IdGroup}
    &type=${type}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  getlist_Reaction()
  {
    const url =this.baseUrl+'/chat/GetDSReaction'
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetInforUserChatWith(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetInforUserChatWith?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetUnreadMess(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetUnreadMess?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetUnreadMessInGroup(IdGroup:number,UserId:number)
  {
    const url =this.baseUrl+`/chat/GetUnreadMessInGroup?IdGroup=${IdGroup}&UserId=${UserId}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  publishMessNotifi(token:string,IdGroup:number,mesage:string,fullname:string,avatar:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiTwoUser?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}&avatar=${avatar}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }


  publishMessNotifiOfline(token:string,IdGroup:number,mesage:string,fullname:string,avatar:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiTwoUserOffLine?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}&avatar=${avatar}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  publishNotifi(item:NotifyMessage): Observable<any>
  {

    const url =this.baseUrl+`/notifi/PushNotifiTagName`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  publishMessNotifiGroup(token:string,IdGroup:number,mesage:string,fullname:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiGroup?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  getGroupName(idgroup:number,customerId:number)
  {
    const url =this.baseUrl+`/notifi/getGroupName?IdGroup=${idgroup}&customerId=${customerId}`
    // const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null);
  }

  publishMessNotifiGroupOffline(token:string,item:any,IdGroup:number,mesage:string,fullname:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiGroupOffline?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  GetUserById(IdUser:number)
  {
    const url =this.baseUrl+`/chat/GetnforUserById?IdUser=${IdUser}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetMessDetailDefault(idgroup:number,idchat:number,queryParams:QueryParamsModelNewLazy )
  {

    const url =this.baseUrl+`/chat/Get_DetailMessDefault?IdGroup=${idgroup}&IdChat=${idchat}`;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });
  }


  getFindHTTPParams(queryParams): HttpParams {
		let params = new HttpParams()
			//.set('filter',  queryParams.filter )
			.set('sortOrder', queryParams.sortOrder)
			.set('sortField', queryParams.sortField)
			.set('page', (queryParams.pageNumber + 1).toString())
			.set('record', queryParams.pageSize.toString());
		let keys = [], values = [];
		if (queryParams.more) {
			params = params.append('more', 'true');
		}
		Object.keys(queryParams.filter).forEach(function (key) {
			if (typeof queryParams.filter[key] !== 'string' || queryParams.filter[key] !== '') {
				keys.push(key);
				values.push(queryParams.filter[key]);
			}
		});
		if (keys.length > 0) {
			params = params.append('filter.keys', keys.join('|'))
				.append('filter.vals', values.join('|'));
		}
		return params;
	}

   //begin load page-home
   GetListMess(queryParams:QueryParamsModelNewLazy , routeFind: string = ''): Observable<QueryResultsModel> {
    const url = this.baseUrl+routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });

	}
  GetListMessDetailBottom(queryParams:QueryParamsModelNewLazy , routeFind: string = ''): Observable<QueryResultsModel> {
    const url = this.baseUrl+routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });

	}

  GetListMessDetailTop(queryParams:QueryParamsModelNewLazy , routeFind: string = ''): Observable<QueryResultsModel> {
    const url = this.baseUrl+routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });

	}
  UpdateUnReadGroup(IdGroup:number,userUpdateRead:any,key:string)
  {
    const url =this.baseUrl+`/chat/UpdateDataUnreadInGroup?IdGroup=${IdGroup}&userUpdateRead=${userUpdateRead}&key=${key}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  UpdateUnRead(IdGroup:number,UserId:number,key:string)
  {
    const url =this.baseUrl+`/chat/UpdateDataUnread?IdGroup=${IdGroup}&UserID=${UserId}&key=${key}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }

  UploadVideo(item)
  {
    const url =this.baseUrl+`/chat/UploadVideos`
    const httpHeader = this.getHttpHeaderFiles();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  set countUnreadMessage(value: number) {
    this.unreadmessageSource.next(value);
  }
}
