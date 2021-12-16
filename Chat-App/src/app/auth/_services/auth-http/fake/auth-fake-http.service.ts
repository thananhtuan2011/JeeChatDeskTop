import { UsersTable } from './../../../../_fake/fake-db/users.table';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserModel } from '../../../_models/user.model';
import { AuthModel } from '../../../_models/auth.model';
import { environment } from '../../../../../environments/environment';

// const API_USERS_URL = `${environment.apiUrl}/users`;
const API_USERS_URL = ``;
const API_USERS_URL_endity = `https://identityserver.jee.vn`;
@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.getUserLogin(email,password).pipe(
      map((result: any) => {
        if (result.status == 1) {
          if (!result.data) {
            return notFoundError;
          }
       

          // const auth = new AuthModel();
          // auth.accessToken = result.data.accessToken;
          // auth.refreshToken = "";
          // auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
          return result;
      }
      else {
        return notFoundError;
      }
    })
    );
  }

  createUser(user: UserModel): Observable<any> {
    // user.roles = [2]; // Manager
    user.accessToken = 'access-token-' + Math.random();
    user.refreshToken = 'access-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/users/default.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }
  getUserByToken__Social(token: string): Observable<any> {
    var p = new HttpHeaders({
     'Content-Type': 'application/json',
      // "Authorization": `Bearer ${token}`,
      "Authorization": `Bearer ${token}`
     
    });
    // 'Authorization': 'Bearer <token>'
    return this.http.get<any>(API_USERS_URL_endity+"/user/me",{ headers: p });    
  }

  

  getUserByToken(token: string): Observable<UserModel> {
    const user = UsersTable.users.find((u) => {
      return u.accessToken === token;
    });

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }

  getUserLogin(user:string,pass:string): Observable<any> 
  {
    return this.http.post<any>(API_USERS_URL+`/Login?Email=${user}&pass=${pass}`,null);
  }
}
