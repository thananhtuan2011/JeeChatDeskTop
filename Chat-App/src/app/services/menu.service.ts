import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryParamsModel, QueryResultsModel } from '../ChatAppModule/models/pagram';
import { HttpUtilsService } from '../crud/utils/http-utils.service';
 

@Injectable()
export class MenuServices {
	data_share$ = new BehaviorSubject<any>([]);
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	layMenuChucNang(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/LayMenuChucNang`, { headers: httpHeaders });
	}

	Count_SoLuongNhacNho(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Count_SoLuongNhacNho`, { headers: httpHeaders });
		
		}
	Get_DSNhacNho(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Get_DSNhacNho`, { headers: httpHeaders });
	}
}
