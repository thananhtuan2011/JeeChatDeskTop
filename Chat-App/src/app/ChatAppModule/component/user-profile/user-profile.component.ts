import { ElectronIpcService } from 'src/app/services/electron-ipc.service';
import { environment } from './../../../../environments/environment.prod';
import { PresenceService } from './../../../services/presence.service';
import { MenuServices } from './../../../services/menu.service';
import { AuthService } from './../../../auth/_services/auth.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<any>;
  listNhacNho: any[] = [];
  AppCode: string = '';
  constructor(private  auth: AuthService,
    public translate: TranslateService, 
    private menuServices: MenuServices,
    private electron_services:ElectronIpcService,
    private presence_services:PresenceService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,) {}

  ngOnInit(): void {
    this.AppCode = environment.APPCODE;
   
   
    this.user$ = this.auth.getAuthFromLocalStorage();
    this.LoadNhacNho();
    // this.user$ = this.auth.currentUserSubject.asObservable();
  }
  ChangeLink(item) {
    if (item.WebAppLink != null && item.WebAppLink != '') {
      if (this.AppCode == item.AppCode) {
        this.router.navigate([item.WebAppLink]);
      }
    }
  }

  quanlytaikhoan(){
    window.open("https://app.jee.vn/ThongTinCaNhan","_blank")
  }

  logout() {
    this.electron_services.DeleteCookie();
    this.presence_services.disconnectToken();
    this.auth.logoutToSSO().subscribe(
      (res) => {
        this.auth.prepareLogout();
      },
      (err) => {
        this.auth.prepareLogout();
      }
    );
  
  }
  public LoadNhacNho() {
    this.menuServices.Get_DSNhacNho().subscribe((res: any) => {
      this.listNhacNho = res.data;
      console.log("  this.listNhacNho",  this.listNhacNho)
      this.changeDetectorRefs.detectChanges();
    });
  }
  getColorNameUser(value: any) {
    let result = "";
    switch (value) {
      case "A":
        return result = "rgb(51 152 219)";
      case "Ă":
        return result = "rgb(241, 196, 15)";
      case "Â":
        return result = "rgb(142, 68, 173)";
      case "B":
        return result = "#0cb929";
      case "C":
        return result = "rgb(91, 101, 243)";
      case "D":
        return result = "rgb(44, 62, 80)";
      case "Đ":
        return result = "rgb(127, 140, 141)";
      case "E":
        return result = "rgb(26, 188, 156)";
      case "Ê":
        return result = "rgb(51 152 219)";
      case "G":
        return result = "rgb(241, 196, 15)";
      case "H":
        return result = "rgb(248, 48, 109)";
      case "I":
        return result = "rgb(142, 68, 173)";
      case "K":
        return result = "#2209b7";
      case "L":
        return result = "rgb(44, 62, 80)";
      case "M":
        return result = "rgb(127, 140, 141)";
      case "N":
        return result = "rgb(197, 90, 240)";
      case "O":
        return result = "rgb(51 152 219)";
      case "Ô":
        return result = "rgb(241, 196, 15)";
      case "Ơ":
        return result = "rgb(142, 68, 173)";
      case "P":
        return result = "#02c7ad";
      case "Q":
        return result = "rgb(211, 84, 0)";
      case "R":
        return result = "rgb(44, 62, 80)";
      case "S":
        return result = "rgb(127, 140, 141)";
      case "T":
        return result = "#bd3d0a";
      case "U":
        return result = "rgb(51 152 219)";
      case "Ư":
        return result = "rgb(241, 196, 15)";
      case "V":
        return result = "#759e13";
      case "X":
        return result = "rgb(142, 68, 173)";
      case "W":
        return result = "rgb(211, 84, 0)";
    }
    return result;
  }
}
