

export class CuocHopModel  {
	TenCuocHop: string;
	thoigiandate: any;
	thoigiantime: string;
	thoigianminute: string;
    SuDungPhongHop: string;
	SuDungPhongHopInput: any;
	XacNhanThamGia: boolean;
	NhapTomTat: boolean;
	GhiChu: string;
    ListThamGia: any ;
	ListTheoDoi: any;
	ListTomTat: any;
    TaiSanKhac:any;
	LoaiTaiSan:number;
	isEdit:number;
	isAdd:number;
	RowID:number;
	IDPhongHop:any;
	ZoomMeetting:boolean
	GoogleMeetting:boolean

	clear() {
		this.TenCuocHop = ''
        this.thoigiandate= ''
        this.thoigiantime= ''
        this.thoigianminute= ''
		this.SuDungPhongHop = ''
        this.SuDungPhongHopInput = [];
        this.XacNhanThamGia= false;
        this.NhapTomTat = false;
        this.GhiChu = ''
        this.ListThamGia= [];
        this.ListTheoDoi= [];
        this.ListTomTat= [];
        this.TaiSanKhac = [];
		this.LoaiTaiSan = 1;
		this.isEdit = 0;
		this.isAdd = 0;
		this.RowID = 0
		this.ZoomMeetting = false
		this.GoogleMeetting = false
		this.IDPhongHop = ''
	}
}
export class TaiSanModel  {
	IdPhieu:number = -1;
	RoomID: number = 0;
	BookingDate: any;
	FromTime: string;
	ToTime: string;
    MeetingContent: string;
	NVID: any;
	TenPhong: string;
    DiaDiem:string ;
	chitiet:string = "";
}
