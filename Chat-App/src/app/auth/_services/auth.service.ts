import { CookieService } from 'ngx-cookie-service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, finalize, catchError } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { AuthSSO } from '../_models/authSSO.model';
import { Router } from '@angular/router';
const electron = (<any>window).require('electron');

const redirectUrl = environment.HOST_REDIRECTURL + '/?redirectUrl=';
const DOMAIN = environment.DOMAIN_COOKIES;
const API_IDENTITY = `${environment.HOST_IDENTITYSERVER_API}`;
const API_IDENTITY_LOGOUT = `${API_IDENTITY}/user/logout`;
const API_IDENTITY_USER = `${API_IDENTITY}/user/me`;
const API_IDENTITY_REFESHTOKEN = `${API_IDENTITY}/user/refresh`;
const KEY_SSO_TOKEN = 'sso_token';
const KEY_RESRESH_TOKEN = 'sso_token_refresh';
const API_IDENTITY_LOGIN = `${API_IDENTITY}/user/login`;
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];

  // public fields
  currentUser$: Observable<UserModel>;

  currentUserSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(undefined);
  authSSOModelSubject$: BehaviorSubject<AuthSSO> = new BehaviorSubject<AuthSSO>(undefined);
  // Private fields
  isLoading$ = new BehaviorSubject<boolean>(false);
  isFirstLoading$ = new BehaviorSubject<boolean>(true);
  errorMessage = new BehaviorSubject<string>(undefined);
  subscriptions: Subscription[] = [];

  private userSubject = new BehaviorSubject<any | null>(null);

  User$: Observable<any> = this.userSubject.asObservable();

  constructor(private http: HttpClient, 
    private router: Router,private authHttpService: AuthHTTPService, private cookieService: CookieService) {
    this.isLoading$ = new BehaviorSubject<boolean>(false);
    if (this.getAccessToken_cookie()) {

      this.getUserMeFromSSO().subscribe(
        (data) => {
          if (data && data.access_token) {
            this.userSubject.next(data);
            this.saveToken_cookie(data.access_token, data.refresh_token);
          }
        },
        (error) => {
          this.refreshToken().subscribe(
            (data: AuthSSO) => {
              if (data && data.access_token) {
                this.userSubject.next(data);
                this.saveToken_cookie(data.access_token, data.refresh_token);
              }
            },
            (error) => {
              this.logout();
            }
          );
        },
        () => {
          setInterval(() => {
            if (!this.getAccessToken_cookie() && !this.getRefreshToken_cookie()) this.prepareLogout();
          }, 20000);
        }
      );
    }
    setInterval(() => this.autoGetUserFromSSO(), 60000);
  }

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }


  
  getHttpHeaders() {


    // console.log('auth.token',auth.access_token)
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }
login(data) {
  const httpHeader = this.getHttpHeaders();
  return this.http.post<any>(API_IDENTITY_LOGIN,data,{ headers: httpHeader});
    }
    private handleError<T>(operation = 'operation', result?: any) {
      return (error: any): Observable<any> => {
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead

          // Let the app keep running by returning an empty result.
          return of(result);
      };
  }
  getUserId() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].userID;
  }
  getAccessToken_cookie() {
    let dl;
    let token;
     var cookies=this.getCookie({ name: 'token'})
    //  console.log("cookies",cookies)
     if(cookies&&cookies.length>0&&cookies[0].value!=="")
     {
       dl=JSON.parse(cookies[0].value)
       token=dl.access_token
     }
      const access_token =token;
    return access_token;
  
  }

  saveToken_cookie(access_token?: string, refresh_token?: string) {

    let data={
      access_token:access_token,
      refresh_token:refresh_token
    
    }
    this.setCookie({ url: 'https://github.com', name: 'token',value:JSON.stringify(data), expirationDate: 9999999999 })
   
  }

  getRefreshToken_cookie() {
    let refresh_token;
    let dl;
    var cookies=this.getCookie({ name: 'token'})
    if(cookies&&cookies.length>0&&cookies[0].value!=="")
    {
      dl=JSON.parse(cookies[0].value)
      refresh_token= dl.refresh_token
    }
   
    const sso_token =refresh_token
    return sso_token;
  }

  deleteAccessRefreshToken_cookie() {
    this.setCookie({ url: 'https://github.com', name: 'token',value:"", expirationDate: 9999999999 })
  }

  autoGetUserFromSSO() {
    const auth = this.getAuthFromLocalStorage();
    if (auth) {
      this.saveNewUserMe();
    }
  }

  saveNewUserMe(data?: any) {
    if (data) {
      this.userSubject.next(data);
      this.saveToken_cookie(data.access_token, data.refresh_token);
    }
    this.getUserMeFromSSO().subscribe(
      (data) => {
        if (data && data.access_token) {
          this.userSubject.next(data);
          this.saveToken_cookie(data.access_token, data.refresh_token);
        }
      },
      (error) => {
        this.refreshToken().subscribe(
          (data: AuthSSO) => {
            if (data && data.access_token) {
              this.userSubject.next(data);
              this.saveToken_cookie(data.access_token, data.refresh_token);
            }
          },
          (error) => {
            this.logout();
          }
        );
      }
    );
  }
  

  setCookie(cookie){
    return electron.ipcRenderer.sendSync('set-cookie-sync', cookie)
  }

  getCookie(filter){
    return electron.ipcRenderer.sendSync('get-cookie-sync', filter)
  }

  isAuthenticated(): boolean {
    var cookies=this.getCookie({ name: 'token'})
    // console.log("isAuthenticated",cookies)
    if(cookies&&cookies.length>0&&cookies[0].value!=="")
    {
        let dl=JSON.parse(cookies[0].value)
    
      
    const access_token = dl.access_token;
    const refresh_token = dl.refresh_token;
    if (access_token) {
      if (this.isTokenExpired(access_token)) {
        this.saveToken_cookie(access_token);
        return true;
      }
    }
    if (refresh_token) {
      if (this.isTokenExpired(refresh_token)) {
        this.saveToken_cookie(undefined, refresh_token);
        return true;
      }
    }
    return false;
  
  }
  }

  isTokenExpired(token: string): boolean {
    const date = this.getTokenExpirationDate(token);
    if (!date) return false;
    return date.valueOf() > new Date().valueOf();
  }

  getTokenExpirationDate(auth: string): Date {
    let decoded: any = jwt_decode(auth);
    if (!decoded.exp) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  LogOutOs()
  
  {
    let host="https://portal.jee.vn";
    const iframeSource = `${host}/?logout=true`
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', iframeSource)
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    window.addEventListener(
      'message',
      () => {
        window.location.reload()
      },
      false
    )
  }
  logout() {
 
    console.log("this.LogOutOs()",this.LogOutOs());
    const access_token = this.getAccessToken_cookie();
    
    console.log("Vào logout",access_token)
    if (access_token) {
      this.logoutToSSO().subscribe(
        (res) => {
          this.prepareLogout();
        },
        (err) => {
          this.prepareLogout();
        }
      );
    } else {
      this.prepareLogout();
    }
    this.deleteAccessRefreshToken_cookie();
  }

  prepareLogout() {
    console.log("Chạy vào prepare logout")
   
    // window.open('https://portal.jee.vn/sso', '_blank', 'chrome=yes,centerscreen,width=600,height=800,top=400,left=600,resizeable');
 this.router.navigateByUrl('/login')
    
    // let url = '';
    // if (document.location.port) {
    //   url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port;
    // } else {
    //   url = redirectUrl + document.location.protocol + '//' + document.location.hostname;
    // }
    // window.location.href = url;
    
  }

  getParamsSSO() {
    const url = window.location.href;
    let paramValue = undefined;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get('sso_token');
    }
    console.log("sso_token",paramValue)
    return paramValue;
  }

  getAuthFromLocalStorage() {


    return this.userSubject.value;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // call api identity server
  getUserMeFromSSO(): Observable<any> {
    let dl;
   let token;
    var cookies=this.getCookie({ name: 'token'})
    if(cookies&&cookies.length>0&&cookies[0].value!=="")
    {
      dl=JSON.parse(cookies[0].value)
      token=dl.access_token
    }
    // console.log("tokengetUserMeFromSSO",token)
    const access_token = token;
    const url = API_IDENTITY_USER;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    });
    return this.http.get<any>(url, { headers: httpHeader });
  }

  refreshToken(): Observable<any> {
    let dl;
   let refreshtoken;
    var cookies=this.getCookie({ name: 'token'})
    if(cookies&&cookies.length>0&&cookies[0].value!=="")
    {
      dl=JSON.parse(cookies[0].value)
      refreshtoken=dl.refresh_token
    }
    
    
    const refresh_token = refreshtoken;
    
    const url = API_IDENTITY_REFESHTOKEN;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refresh_token}`,
    });
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  logoutToSSO(): Observable<any> {
    const access_token = this.getAccessToken_cookie();
    const url = API_IDENTITY_LOGOUT;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    });
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  // end call api identity server

  // method metronic call
  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }
    this.isLoading$.next(true);
    return this.authHttpService.getUserByToken(auth.accessToken).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoading$.next(false))
    );
  }

  forgotPassword(value: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  registration(newUser: UserModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getStaffId() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].staffID;
  }
  getAppCodeId() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].appCode;
  }
}
