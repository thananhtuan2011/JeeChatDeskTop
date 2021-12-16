import { environment } from './../../environments/environment.prod';
import { AuthService } from './../auth/_services/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../crud/utils/http-utils.service';
 

@Injectable()
export class NotifyServices {
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService,
        private auth : AuthService) { }

	getListApp(): Observable<any> {
		const auth = this.auth.getAuthFromLocalStorage();
		const httpHeader = new HttpHeaders({
		  Authorization: `Bearer ${auth!=null ? auth.access_token : ''}`,
		});
		const httpParam = new HttpParams().set('userID', this.auth.getUserId())
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API+'/api/accountmanagement/GetListAppByUserID', {
				headers: httpHeader,
				params: httpParam
			});
	}
    getNotificationList(isRead: any): Observable<any> {
        const auth = this.auth.getAuthFromLocalStorage();
        const httpHeader = new HttpHeaders({
          Authorization: `${auth!=null ? auth.access_token : ''}`,
        });
        const httpParam = new HttpParams().set('status', isRead)
        return this.http.get<any>(environment.HOST_NOTIFICATION+'/notification/pull', {
                headers: httpHeader,
                params: httpParam
            });
      }
}
