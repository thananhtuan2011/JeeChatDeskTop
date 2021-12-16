

import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
// import { TableService } from "./../../../../_metronic/shared/crud-table";
import { HttpUtilsService } from "../crud/utils/http-utils.service";
import { AuthService } from "../auth/_services/auth.service";
import { QueryParamsModel, QueryParamsModelNew, QueryResultsModel } from "../ChatAppModule/models/pagram";
import { environment } from "src/environments/environment";
const API_DatPhong = environment.HOST_JEEADMIN_API ;
const API_general = environment.HOST_JEEMEETING_API + "/api/General";
const API_Meeting = environment.HOST_JEEMEETING_API + "/api/Meeting";
@Injectable()
export class DangKyCuocHopService  {
	data_share$ = new BehaviorSubject<any>([]);
	API_URL = `/api/YeuCau`;

	lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
	public loadListCuocHopCuaToi: string = '/api/Meeting' + '/Get_DanhSachCuocHopCuaToi';
	public loadListCuocHopToiThamGia: string =  '/api/Meeting' + '/Get_DanhSachCuocHopToiThamGia';
	public loadListCuocHop: string =  '/api/Meeting' + '/Get_DanhSachCuocHop';
	public loadDSHuy :string = "/api/datphonghop/Get_DSHuyDatPhong"
	ReadOnlyControl: boolean;
	constructor(
    private http: HttpClient,
		private httpUtils: HttpUtilsService, auth:AuthService
	) {

	}
	//=================================================================================================================
	Get_GioDatPhongHop(gio: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_general +  `/Get_GioDatPhongHop?gio=${gio}`,
			{ headers: httpHeaders }
		);
	}
	Insert_DatPhongHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_DatPhong + '/api/datphonghop/KT_ThoiGianDat', item, { headers: httpHeaders });
	}
	Insert_CuocHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Meeting + '/Insert_CuocHop', item, { headers: httpHeaders });
	}
	findData(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DatPhong + '/api/datphonghop/Get_DSDatPhongHop';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	findDataZoom(idPhong:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_Meeting + `/Get_DSZoom?IdPhongHop=${idPhong}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders
		});
	}
	GetListPhongHop(loai:number): Observable<any> {//Dùng cho chức năng đặt phòng họp
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_DatPhong + `/api/taisan/Get_ListTaiSan?loai=${loai}`, { headers: httpHeaders });
	}
	getDSNhanVien(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
	const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<QueryResultsModel>(
        API_general + `/LoadDSNhanVien`,
        { headers: httpHeaders ,params: httpParams }
    );
	}
	Get_DSCuocHop(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/Get_DanhSachCuocHop`,
			{ headers: httpHeaders,params: httpParams }
		);
	}
	Get_ChiTietCuocHop(meetingid:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/Get_ChiTietCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	Get_ChiTietCuocHopEdit(meetingid:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/Get_ChiTietCuocHopEdit?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	Get_ChiTietCuocHopZoom(meetingid:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/Get_ChiTietCuocHopZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	TaoCongViec(item:any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_Meeting +  `/TaoCongViec`,item,
			{ headers: httpHeaders }
		);
	}
	CapNhatTomTatKetLuan(item:any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_Meeting +  `/CapNhatTomTatKetLuan`,item,
			{ headers: httpHeaders }
		);
	}
	XacNhanThamGia(meetingid:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/XacNhanThamGia?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	DongCuocHop(meetingid:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/DongCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XoaCuocHop(meetingid:number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/XoaCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEMEETING_API + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
		  headers: httpHeaders,
		  responseType: 'text'
		});
	  }
	  Confirm_DatPhongHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_DatPhong + '/api/datphonghop/Confirm_DatPhongHop';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	setUpConfigZoom(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_Meeting + '/SetupZoom';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	setUpConfigGoogle(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_Meeting + '/SetupGoogle';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	ZoomConfig(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/ZoomConfig`,
			{ headers: httpHeaders }
		);
	}
	GoogleConfig(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/GoogleConfig`,
			{ headers: httpHeaders }
		);
	}
	GoogleKey(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/GoogleKey`,
			{ headers: httpHeaders }
		);
	}
	SoLuongChoCapNhat(loai:any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/SoLuongChoCapNhat?loai=${loai}`,
			{ headers: httpHeaders }
		);
	}

	ListKey(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_Meeting +  `/List-Key`,
			{ headers: httpHeaders }
		);
	}
}
