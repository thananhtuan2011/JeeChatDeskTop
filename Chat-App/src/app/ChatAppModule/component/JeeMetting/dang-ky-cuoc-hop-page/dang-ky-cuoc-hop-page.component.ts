import { TaiSanModel } from '../../../models/DuLieuCuocHop.model';
import { AuthService } from '../../../../auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../../crud/utils/layout-utils.service';
import { StateService } from '../../../../services/state.service';
import { DangKyCuocHopService } from '../../../../services/dang-ky-cuoc-hop.service';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Renderer2,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ReplaySubject } from "rxjs";
import { CuocHopModel } from "../../../models/DuLieuCuocHop.model";
import { ZoomConfigComponent } from '../zoom-config/zoom-config.component';
import { GoogleConfigComponent } from '../google-config/google-config.component';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { formatDate } from '@angular/common';

@Component({
  selector: "app-dang-ky-cuoc-hop-page",
  templateUrl: "./dang-ky-cuoc-hop-page.component.html",
  styleUrls: ["./dang-ky-cuoc-hop-page.component.scss"],
})
export class DangKyCuocHopPageComponent implements OnInit {
  //google
  public gapiSetup: boolean = false; // marks if the gapi library has been loaded
  public authInstance: gapi.auth2.GoogleAuth;
  public error: string;
  public user: gapi.auth2.GoogleUser;
  public accsess_token: string;
  flagMeeting: number;
  authRes: any;
  //end google
  options: any = {};
  options1: any = {};
  options2: any = {};
  formControls: FormGroup;
  item: any;
  ShowDangKyTaiSanKhac: boolean = false;
  ShowDangKyTaiSanKhac2: boolean = false;
  disabledBtn: boolean = false;
  chosenZoom: any;
  chosenGoogle: any;
  chosenItem: any;
  //====================Dropdown search============================
  //====================Nhân viên====================
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //====================Từ Giờ====================
  public bankTuGio: FormControl = new FormControl();
  public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //====================Đến giờ====================
  public bankDenGio: FormControl = new FormControl();
  public filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  public phonghopname: FormControl = new FormControl();
  public filteredPhongHop: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  ThoiGianPhongHop: any = "08:00";
  GioNghi: any[] = [];
  DenGio: any[] = [];
  ListPhongHop: any[] = [];
  ListPhongHopCustom: any[] = [];
  currentDate: any;
  listNguoiThamGia: any[] = [];
  listNguoiTheoDoi: any[] = [];
  listNguoiTomTat: any[] = [];
  state: CuocHopModel;
  GioBatDau: any;
  GioKetThuc: any;
  NgayBatDau: any;
  clickNhapTomTat: boolean = false;
  // HideDropDow: boolean = false
  thongtinphonghop: string = "";
  TaiSan: TaiSanModel;
  flag: number = 1;
  UserID: number;
  loaiTaiSan: number = 1;
  listValues: any[] = [];
  currentCheckedValue = null;
  client_id: string;
  checkedZoom: boolean = false;
  checkedGoogle: boolean = false;

  selectedZoom: boolean = false;
  listKey:any[]=[]
  constructor(
    public dialog: MatDialog,
    private dangKyCuocHopService: DangKyCuocHopService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private stateService: StateService,
    private layoutUtilsService: LayoutUtilsService,
    private auth: AuthService,
    private ren: Renderer2,
    private dialogRef:MatDialogRef<DangKyCuocHopPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    const authdata = auth.getAuthFromLocalStorage();
    // this.UserID = +localStorage.getItem("idUser");
    this.UserID =
      +authdata != null
        ? authdata["user"]["customData"]["jee-account"]["userID"]
        : 0;
  }

  CloseDia(data = undefined)
  {


      this.dialogRef.close(data);
  }
  ngOnInit(): void {
    let currentdate=new Date();
    this.NgayBatDau=new Date();
    this.listNguoiThamGia=this.data;

     console.log("listNguoiThamGia",this.listNguoiThamGia)
    // this.listNguoiThamGia = res.data
    this.dangKyCuocHopService.ListKey().subscribe((res) => {
      this.listKey = res.data;
      this.changeDetectorRefs.detectChanges();
    });

    this.state = this.stateService.state$.getValue() || null;
    if (this.state != null && this.state.isAdd == 1) {
      this.listValues = [];
      this.ShowDangKyTaiSanKhac = true;
      this.thongtinphonghop =
        this.state.SuDungPhongHopInput.TenPhong +
        ", " +
        this.LayThu(this.state.SuDungPhongHopInput.BookingDate) +
        " " +
        this.f_convertDate(this.state.SuDungPhongHopInput.BookingDate) +
        ", " +
        this.state.SuDungPhongHopInput.FromTime +
        " - " +
        this.state.SuDungPhongHopInput.ToTime;
      this.GioBatDau = this.state.SuDungPhongHopInput.FromTime;
      this.NgayBatDau = this.state.SuDungPhongHopInput.BookingDate;
      this.TaiSan = new TaiSanModel();
      this.TaiSan.RoomID = this.state.SuDungPhongHopInput.RoomID;
      this.TaiSan.BookingDate = this.state.SuDungPhongHopInput.BookingDate;
      this.TaiSan.FromTime = this.state.SuDungPhongHopInput.FromTime;
      this.TaiSan.ToTime = this.state.SuDungPhongHopInput.ToTime;
      this.TaiSan.MeetingContent =
        this.state.SuDungPhongHopInput.MeetingContent;
      this.TaiSan.TenPhong = this.state.SuDungPhongHopInput.TenPhong;
      this.TaiSan.NVID = this.state.SuDungPhongHopInput.NVID;
      this.TaiSan.DiaDiem = this.thongtinphonghop;
      if(this.state.ZoomMeetting){
        this.checkedZoom = true
        this.checkedGoogle = false
        this.selectedZoom = true
      }else if(this.state.GoogleMeetting){
        this.checkedGoogle = true
        this.checkedZoom = false
      }
      this.loadEditMeet(this.state.ZoomMeetting,this.state.GoogleMeetting)
      if (this.state.TaiSanKhac) {
        this.ShowDangKyTaiSanKhac2 = true;
        this.ThemCotTaiSan();
      }
      this.formControls = new FormGroup({
        TenCuocHop: new FormControl(),
        thoigiandate: new FormControl(this.state.thoigiandate),
        thoigiantime: new FormControl(this.state.thoigiantime),
        thoigianminute: new FormControl(30),
        SuDungPhongHopInput: new FormControl(this.thongtinphonghop),
        XacNhanThamGia: new FormControl(this.state.XacNhanThamGia),
        NhapTomTat: new FormControl(this.state.NhapTomTat),
        GhiChu: new FormControl(this.state.GhiChu),
        IDPhongHop: new FormControl(this.state.IDPhongHop),
      });
      if(this.state.NhapTomTat){
        this.clickNhapTomTat = true
      }
      this.listNguoiThamGia = this.state.ListThamGia;
      this.listNguoiTheoDoi = this.state.ListTheoDoi;
      this.listNguoiTomTat = this.state.ListTomTat;
      this.state.clear();
      this.stateService.state$.next(null);
    } else {
      this.formControls = new FormGroup({
        TenCuocHop: new FormControl(),
        thoigiandate: new FormControl(),
        thoigiantime: new FormControl(),
        thoigianminute: new FormControl(30),
        // SuDungPhongHop: new FormControl(),
        SuDungPhongHopInput: new FormControl(),
        XacNhanThamGia: new FormControl(),
        NhapTomTat: new FormControl(),
        GhiChu: new FormControl(),
        IDPhongHop: new FormControl(),
      });
    }
    this.dangKyCuocHopService.Get_GioDatPhongHop("").subscribe((res) => {
      console.log("GioNghi",res.data)
      this.GioNghi = res.data;
      this.DenGio = res.data;
      let minutes=currentdate.getMinutes();
    
      let phut;
      debugger
      if(minutes%5==0)
      {
        if(minutes==60)
        {
          this.GioBatDau= ("0" + currentdate.getHours()+1).slice(-2)+":"+'00';
        }
        else
        {
          if(minutes<10)
        {
          this.GioBatDau= ("0" + currentdate.getHours()).slice(-2)+":"+"0"+minutes;
        }
        else

        {
          this.GioBatDau= ("0" + currentdate.getHours()).slice(-2)+":"+minutes;
        }
         
        }
       
      }
      else
      {
        
        do
	{
    minutes=minutes+1;
    if(minutes%5==0)
    {
      phut=minutes;
     
    }

  }while (minutes%5!==0);
        if(phut<10)
        {
          phut="0"+phut
        }
        this.GioBatDau= ("0" + currentdate.getHours()).slice(-2)+":"+phut;

      }
      
      console.log("GioBatDau",this.GioBatDau)
   
        
      let index=this.GioNghi.findIndex(x=>x.Gio==this.GioBatDau);
      this.GioBatDau=this.GioNghi[index].Gio
      this.setUpDropSearchTuGio();
      this.setUpDropSearchDenGio();
      this.changeDetectorRefs.detectChanges();
    });


  }
  PrepareDataState() {
    const controls = this.formControls.controls;
    const _item = new CuocHopModel();
    _item.TenCuocHop = controls["TenCuocHop"].value;
    _item.thoigiandate = controls["thoigiandate"].value;
    _item.thoigiantime = controls["thoigiantime"].value;
    _item.thoigianminute = controls["thoigianminute"].value;
    // _item.SuDungPhongHop = controls["SuDungPhongHop"].value
    _item.SuDungPhongHopInput = this.TaiSan;
    _item.XacNhanThamGia = controls["XacNhanThamGia"].value;
    _item.NhapTomTat = controls["NhapTomTat"].value;
    _item.GhiChu =
      controls["GhiChu"].value == null ? "" : controls["GhiChu"].value;
    _item.ListThamGia = this.listNguoiThamGia;
    _item.ListTheoDoi = this.listNguoiTheoDoi;
    _item.ListTomTat = this.listNguoiTomTat;
    _item.LoaiTaiSan = this.loaiTaiSan;
    _item.TaiSanKhac = this.listValues;
    _item.isAdd = 0;
    _item.ZoomMeetting = this.currentCheckedValue == "1" ? true : false;
    _item.GoogleMeetting = this.currentCheckedValue == "2" ? true : false;
    if(this.currentCheckedValue == "1" ){
      _item.IDPhongHop =  controls["IDPhongHop"].value == null ? "" : controls["IDPhongHop"].value
    }
    this.stateService.state$.next(_item);
    this.stateService.stateEdit$.next(null);
  }
  PrepareData(token: string = "") {
    const controls = this.formControls.controls;
    debugger
    if(controls["NhapTomTat"].value == true){
      if(this.listNguoiTomTat.length == 0){
        this.layoutUtilsService.showActionNotification(
          "Vui lòng chọn người nhập tóm tắt, kết luận",
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
        this.disabledBtn = false
        this.changeDetectorRefs.detectChanges();
        return;
      }
    }else{
      this.listNguoiTomTat = []
    }
    if(this.currentCheckedValue == "1"){
      if(controls["IDPhongHop"].value == null){
        this.layoutUtilsService.showActionNotification(
          "vui lòng chọn phòng họp",
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
        this.disabledBtn = false
        this.changeDetectorRefs.detectChanges();
        return;
      }
    }
    let _field = {
      TenCuocHop: controls["TenCuocHop"].value,
      thoigiandate: this.f_convertDateUTC(controls["thoigiandate"].value),
      thoigiantime: controls["thoigiantime"].value,
      thoigianminute: controls["thoigianminute"].value,
      //   SuDungPhongHop: controls["SuDungPhongHop"].value==null?0:controls["SuDungPhongHop"].value,
      XacNhanThamGia:
        controls["XacNhanThamGia"].value == null
          ? false
          : controls["XacNhanThamGia"].value,
      NhapTomTat:
        controls["NhapTomTat"].value == null
          ? false
          : controls["NhapTomTat"].value,
      GhiChu: controls["GhiChu"].value,
      PhongHopDangKy: this.TaiSan,
      ListThamGia: this.listNguoiThamGia,
      ListTheoDoi: this.listNguoiTheoDoi,
      ListTomTat: this.listNguoiTomTat,
      TaiSanKhac: this.listValues,
      ZoomMeeting: this.currentCheckedValue == "1" ? true : false,
      GoogleMeeting: this.currentCheckedValue == "2" ? true : false,
      token: token,
      IDPhongHop : this.currentCheckedValue == "1" ?(controls["IDPhongHop"].value == null ? "" : controls["IDPhongHop"].value):0
    };
    console.log(_field);
    return _field;
  }
  prenventInputNonNumber(event) {
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    }
  }

  async initGoogleAuth(): Promise<void> {
    const pload = new Promise((resolve) => {
      gapi.load("auth2", resolve);
    });
    return pload.then(async () => {
      await gapi.auth2
        .init({
          client_id: this.client_id,
          scope: "https://www.googleapis.com/auth/calendar",
        })
        .then((auth) => {
          this.gapiSetup = true;
          this.authInstance = auth;
          console.log(auth.currentUser.get());
        });
    });
  }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    this.disabledBtn = false
    this.changeDetectorRefs.detectChanges();
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }
    return new Promise(async () => {
      debugger;
      await this.authInstance.signIn().then(
        (user: any) => {
          this.user = user;
          this.accsess_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
          this.dangKyCuocHopService
            .Insert_CuocHop(this.PrepareData(this.accsess_token))
            .subscribe((res: any) => {
              if (res && res.status === 1) {
                this.disabledBtn = false
                this.changeDetectorRefs.detectChanges();
                this.layoutUtilsService.showActionNotification(
                  "Thêm thành công",
                  MessageType.Read,
                  4000,
                  true,
                  false,
                  2000,
                  "top",
                );
                // this.router.navigate(["/meeting"]);
              } else {
                this.disabledBtn = false
                this.changeDetectorRefs.detectChanges();
                this.layoutUtilsService.showActionNotification(
                  res.error.message,
                  MessageType.Read,
                  9999999999,
                  true,
                  false,
                  3000,
                  "top",
                  0
                );
              }
            });
        },
        (error) => (this.error = error)
      );
    });
  }
  TaoCuocHop() {
    this.disabledBtn = true
    this.changeDetectorRefs.detectChanges();
    const controls = this.formControls.controls;
    if (this.formControls.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.disabledBtn = false
      this.changeDetectorRefs.detectChanges();
      return;
    }
    if (this.flagMeeting == 2) {
      this.authenticate();
    } else {
      this.dangKyCuocHopService
        .Insert_CuocHop(this.PrepareData())
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.disabledBtn = false
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Thêm thành công",
              MessageType.Read,
              4000,

              true,
              false,
              2000,
              "top",
            );

            this.goBack();

          } else {
            this.disabledBtn = false
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              9999999999,
              true,
              false,
              3000,
              "top",
              0
            );
          }
        });
    }
  }
  filterConfigurationDK(): any {
    const filter: any = {};
    this.currentDate = new Date();
    filter.TuNgay =
      this.currentDate.getDate() +
      "/" +
      (this.currentDate.getMonth() + 1) +
      "/" +
      this.currentDate.getFullYear();
    return filter;
  }
  stopPropagation(event) {
    event.stopPropagation();
  }



  AddThanhVien(loai:number) {
    if(loai == 1){
      let _item = this.listNguoiThamGia;
      const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '40%' });
      dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }


      res.data.forEach(element => {



    let y=
    {
      InfoMemberUser:[
        {
          ChucVu: element.ChucVu,
          HoTen: element.HoTen,
          Image: element.Image,
          idUser: element.idUser,
          username: element.username,
        }
      ]


    }


    let  temp={
      Fullname:element.HoTen
    }
    let dl= Object.assign(temp, y);
    this.listNguoiThamGia.push(dl)

    });

console.log("Người Tham gia",this.listNguoiThamGia)
      this.changeDetectorRefs.detectChanges();
      });
    }
    if(loai == 2){
      let _item = this.listNguoiTheoDoi;
      const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '40%' });
      dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.listNguoiTheoDoi = res.data
      console.log("listNguoiTheoDoi",this.listNguoiTheoDoi)
      this.changeDetectorRefs.detectChanges();
      });
    }
    if(loai == 3){
      let _item = this.listNguoiTomTat;
      const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '40%'});
      dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.listNguoiTomTat = res.data
      this.changeDetectorRefs.detectChanges();
      });
    }
  }
  ItemSelectedThamGia(event) {
    var index = this.listNguoiThamGia.findIndex(
      (x) => x.idUser == event.idUser
    );
    if (index < 0) {
      this.listNguoiThamGia.push(event);
    } else {
      this.listNguoiThamGia.splice(index, 1);
    }
  }
  deleteUserThamGia(user) {
    var index = this.listNguoiThamGia.findIndex((x) => x.idUser == user.idUser);
    this.listNguoiThamGia.splice(index, 1);
  }
  // ItemSelectedTheoDoi(event) {
  //   var index = this.listNguoiTheoDoi.findIndex(
  //     (x) => x.idUser == event.idUser
  //   );
  //   if (index < 0) {
  //     this.listNguoiTheoDoi.push(event);
  //   } else {
  //     this.listNguoiTheoDoi.splice(index, 1);
  //   }
  // }
  deleteUserTheoDoi(user) {
    var index = this.listNguoiTheoDoi.findIndex((x) => x.idUser == user.idUser);
    this.listNguoiTheoDoi.splice(index, 1);
  }
  // ItemSelectedTomTat(event) {
  //   var index = this.listNguoiTomTat.findIndex((x) => x.idUser == event.idUser);
  //   if (index < 0) {
  //     this.listNguoiTomTat.push(event);
  //   } else {
  //     this.listNguoiTomTat.splice(index, 1);
  //   }
  // }
  deleteUserTomTat(user) {
    var index = this.listNguoiTomTat.findIndex((x) => x.idUser == user.idUser);
    this.listNguoiTomTat.splice(index, 1);
  }
  dangKyTaiSan() {
    this.loaiTaiSan = 2;
    this.PrepareDataState();
    this.router.navigate(["/meeting/dang-ky-tai-san"]);
  }
  ThemCotTaiSan() {
    // if(this.listValues[this.listValues.length==0?0:this.listValues.length-1].length <= 0) return
    // let index = this.listValues.length-1
    // let item = {
    // 	Title: "",
    // };
    // let ind = index + 1;
    // this.listValues.splice(ind, 0, item);
    this.listValues = this.state.TaiSanKhac;
    // this.changeDetectorRefs.detectChanges();
  }
  remove(item) {
    const index = this.listValues.indexOf(item, 0);
    if (index > -1) {
      this.listValues.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }
  dangKyPhongHop() {
    this.loaiTaiSan = 1;
    this.ShowDangKyTaiSanKhac = false;
    this.PrepareDataState();
    this.router.navigate(["/meeting/dang-ky-tai-san"]);
  }
  //=================================================================================================================================
  f_convertDate(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
  }
  f_convertHour(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }
  f_number(value: any) {
    return Number((value + "").replace(/,/g, ""));
  }

  f_currency(value: any, args?: any): any {
    let nbr = Number((value + "").replace(/,|-/g, ""));
    return (nbr + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  //=========================
  setUpDropSearchTuGio() {
    this.bankTuGio.setValue("");
    this.filterBanksTuGio();
    this.bankTuGio.valueChanges.pipe().subscribe(() => {
      this.filterBanksTuGio();
    });
  }

  protected filterBanksTuGio() {
    if (!this.GioNghi) {
      return;
    }
    // get the search keyword
    let search = this.bankTuGio.value;
    if (!search) {
      this.filteredBanksTuGio.next(this.GioNghi.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksTuGio.next(
      this.GioNghi.filter((bank) => bank.Gio.toLowerCase().indexOf(search) > -1)
    );
  }
  //===========================
  setUpDropSearchDenGio() {
    this.bankDenGio.setValue("");
    this.filterBanksDenGio();
    this.bankDenGio.valueChanges.pipe().subscribe(() => {
      this.filterBanksDenGio();
    });
  }

  protected filterBanksDenGio() {
    if (!this.DenGio) {
      return;
    }
    // get the search keyword
    let search = this.bankDenGio.value;
    if (!search) {
      this.filteredBanksDenGio.next(this.DenGio.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksDenGio.next(
      this.DenGio.filter((bank) => bank.Gio.toLowerCase().indexOf(search) > -1)
    );
  }

  setUpDropSearchPhongHop() {
    this.phonghopname.setValue("");
    this.filterBanksPhongHop();
    this.phonghopname.valueChanges.pipe().subscribe(() => {
      this.filterBanksPhongHop();
    });
  }

  protected filterBanksPhongHop() {
    if (!this.ListPhongHop) {
      return;
    }
    this.ListPhongHopCustom = [];
    for (let index = 0; index < this.ListPhongHop.length; index++) {
      let item = {
        GioBatDau: this.f_convertHour(this.ListPhongHop[index].start),
        GioKetThuc: this.f_convertHour(this.ListPhongHop[index].end),
        NgayBatDau: this.ListPhongHop[index].start,
        id: this.ListPhongHop[index].requestid,
        TenPhong: "Phòng họp số 1",
        Ten: this.CustomNamePhongHop(this.ListPhongHop[index]),
      };
      this.ListPhongHopCustom.push(item);
    }

    // get the search keyword
    let search = this.phonghopname.value;
    if (!search) {
      this.filteredPhongHop.next(this.ListPhongHopCustom.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredPhongHop.next(
      this.ListPhongHopCustom.filter(
        (bank) => bank.Ten.toLowerCase().indexOf(search) > -1
      )
    );
  }
  goBack() {
    this.dialogRef.close();
  }
  CustomNamePhongHop(item: any) {
    this.ThoiGianPhongHop = this.f_convertHour(item.start);
    let temp =
      "Phòng họp số 1" +
      ", " +
      this.LayThu(item.start) +
      " " +
      this.f_convertDate(item.start) +
      ", " +
      this.f_convertHour(item.start) +
      " - " +
      this.f_convertHour(item.end);
    return temp;
  }
  //============================================================================
  //#region khác
  formatDate(item: any) {
    let v = item.start;
    if (!v) return v;
    let t = moment(v).format("HH:mm");
    t = t != "00:00" ? ", " + t : "";
    let str = moment(v).format("DD/MM/YYYY");
    if (str == moment().format("DD/MM/YYYY")) return "Hôm nay" + t;
    if (str == moment(new Date()).add(1, "days").format("DD/MM/YYYY"))
      return "Ngày mai" + t;
    if (str == moment(new Date()).add(-1, "days").format("DD/MM/YYYY"))
      return "Hôm qua";
    return moment(v) < moment() ? str : str + t;
  }
  LayThu(v: any) {
    let day = new Date(v);
    switch (day.getDay()) {
      case 0:
        return "Chủ nhật";
      case 1:
        return "Thứ 2";
      case 2:
        return "Thứ 3";
      case 3:
        return "Thứ 4";
      case 4:
        return "Thứ 5";
      case 5:
        return "Thứ 6";
      case 6:
        return "Thứ 7";
    }
  }
  ngOnDestroy() {}
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 174;
    return tmp_height + "px";
  }
  showOptions(e: any) {
    this.clickNhapTomTat = e.checked;
  }
  PhongHopTrucTuyen(el) {
    this.chosenItem = el;
    if (el.value == "2") {
      this.dangKyCuocHopService.GoogleKey().subscribe((res: any) => {
        this.changeDetectorRefs.detectChanges();
        if (res && res.status === 1) {
          if (res.data) {
            this.client_id = res.data;
          }
        }
      });
    }
  }


  checkState(el) {
    setTimeout(() => {
      // debugger;
      if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
        el.checked = false;
        this.ren.removeClass(el["_elementRef"].nativeElement, "cdk-focused");
        this.ren.removeClass(
          el["_elementRef"].nativeElement,
          "cdk-program-focused"
        );
        this.currentCheckedValue = null;
        this.chosenItem = null;
        this.flagMeeting = 0;
        this.selectedZoom = false
        this.changeDetectorRefs.detectChanges();
      } else {
        this.currentCheckedValue = el.value;
        if (el.value == "1") {
          this.flagMeeting = 1;
          this.selectedZoom = true
          this.changeDetectorRefs.detectChanges();
          this.dangKyCuocHopService.ZoomConfig().subscribe((res: any) => {
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
              if (res.data == false) {
                const _title = "Thông báo cấu hình";
                const _description =
                  "Bạn chưa có thông tin cấu hình Zoom, bạn có muốn thực hiện cầu hình không?";
                const _waitDesciption = "Đang thực hiện";
                const dialogRef2 = this.layoutUtilsService.deleteElement(
                  _title,
                  _description,
                  _waitDesciption,
                  "",
                  false
                );
                dialogRef2.afterClosed().subscribe((res) => {
                  if (res) {
                    const dialogRef = this.dialog.open(ZoomConfigComponent, {
                      data: {},
                      width: "50%",
                      height: "70%",
                    });
                    dialogRef.afterClosed().subscribe((res) => {
                      if (!res) {
                        el.checked = false;
                        this.ren.removeClass(
                          el["_elementRef"].nativeElement,
                          "cdk-focused"
                        );
                        this.ren.removeClass(
                          el["_elementRef"].nativeElement,
                          "cdk-program-focused"
                        );
                        this.currentCheckedValue = null;
                        this.chosenItem = null;
                        this.flagMeeting = 0;
                        this.selectedZoom = false
                        this.changeDetectorRefs.detectChanges();
                      } else {
                        this.layoutUtilsService.showInfo("Thêm thành công");
                      }
                    });
                  } else {
                    el.checked = false;
                    this.ren.removeClass(
                      el["_elementRef"].nativeElement,
                      "cdk-focused"
                    );
                    this.ren.removeClass(
                      el["_elementRef"].nativeElement,
                      "cdk-program-focused"
                    );
                    this.currentCheckedValue = null;
                    this.chosenItem = null;
                    this.flagMeeting = 0;
                    this.selectedZoom = false
                    this.changeDetectorRefs.detectChanges();
                  }
                });
              }
            }
          });
        } else {
          this.flagMeeting = 2;
          this.selectedZoom = false
          this.changeDetectorRefs.detectChanges();
          this.dangKyCuocHopService.GoogleConfig().subscribe((res: any) => {
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
              if (res.data == false) {
                const _title = "Thông báo cấu hình";
                const _description =
                  "Bạn chưa có thông tin cấu hình Google Meet, bạn có muốn thực hiện cầu hình không?";
                const _waitDesciption = "Đang thực hiện";
                const dialogRef2 = this.layoutUtilsService.deleteElement(
                  _title,
                  _description,
                  _waitDesciption,
                  "",
                  false
                );
                dialogRef2.afterClosed().subscribe((res) => {
                  if (res) {
                    const dialogRef = this.dialog.open(GoogleConfigComponent, {
                      data: {},
                      width: "50%",
                      height: "70%",
                    });
                    dialogRef.afterClosed().subscribe((res) => {
                      if (!res) {
                        el.checked = false;
                        this.ren.removeClass(
                          el["_elementRef"].nativeElement,
                          "cdk-focused"
                        );
                        this.ren.removeClass(
                          el["_elementRef"].nativeElement,
                          "cdk-program-focused"
                        );
                        this.currentCheckedValue = null;
                        this.chosenItem = null;
                        this.flagMeeting = 0;
                        this.selectedZoom = false
                        this.changeDetectorRefs.detectChanges();
                      } else {
                        this.layoutUtilsService.showInfo("Thêm thành công");
                        this.dangKyCuocHopService
                          .GoogleKey()
                          .subscribe((res: any) => {
                            this.changeDetectorRefs.detectChanges();
                            if (res && res.status === 1) {
                              if (res.data) {
                                this.client_id = res.data;
                              }
                            }
                          });
                      }
                    });
                  } else {
                    el.checked = false;
                    this.ren.removeClass(
                      el["_elementRef"].nativeElement,
                      "cdk-focused"
                    );
                    this.ren.removeClass(
                      el["_elementRef"].nativeElement,
                      "cdk-program-focused"
                    );
                    this.currentCheckedValue = null;
                    this.chosenItem = null;
                    this.flagMeeting = 0;
                    this.selectedZoom = false
                    this.changeDetectorRefs.detectChanges();
                  }
                });
              }
            }
          });
        }
      }
    });

  }
  f_convertDateUTC(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        a.getFullYear() +
        "-" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + a.getDate()).slice(-2) +
        " 00:00:00.000"
      );
    }
  }
  loadEditMeet(el,el2){
    if (el == true) {
      this.flagMeeting = 1;
      this.currentCheckedValue = "1"
      }
      if(el2 == true) {
      this.flagMeeting = 2;
      this.currentCheckedValue = "2"
      this.dangKyCuocHopService.GoogleKey().subscribe((res: any) => {
        this.changeDetectorRefs.detectChanges();
        if (res && res.status === 1) {
          if (res.data) {
    this.client_id = res.data
    }}})
      }
    }
}
