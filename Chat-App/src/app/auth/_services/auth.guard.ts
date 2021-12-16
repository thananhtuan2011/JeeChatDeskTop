import { LayoutUtilsService, MessageType } from './../../crud/utils/layout-utils.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private layoutUtilsService: LayoutUtilsService) { }
  appCode = environment.APPCODE;
  HOST_JEELANDINGPAGE = environment.HOST_JEELANDINGPAGE;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // console.log("accTibe",this.authService.isAuthenticated())
      // console.log("Data token nè",this.authService.getParamsSSO())
    //   var cookie=this.authService.getCookie()
    // console.log('inside showCookie',cookie)
      if (!this.authService.isAuthenticated()) {
        // if (this.authService.getParamsSSO()) {
         
        //   this.authService.saveToken_cookie(this.authService.getParamsSSO());
        // }
        var cookies=this.authService.getCookie({ name: 'token'})
        // console.log("cookies",cookies)
       if(cookies&&cookies.length>0&&cookies[0].value!=="")
       {

      
        
    
        let dl=JSON.parse(cookies[0].value)
   
        
        // console.log("access_token",dl['access_token'])
        if(dl.access_token)
        {
          const access_token =dl.access_token;
        console.log("access_token",access_token)
        resolve(this.canPassGuard());
        //  resolve(true);
        }
        else
        {
          // console.log("vậy là vào đây rồi")
          // resolve(true);
        resolve(this.canPassGuard());
        }
   
      } else {
        // console.log("VVVVVV")
        resolve(this.canPassGuard());
      }
    }
    else {
      resolve(this.canPassGuard());
    }
    
    });
    
  }

  canPassGuard(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.getUserMeFromSSO().subscribe(
        (data) => {
          resolve(this.canPassGuardAccessToken(data));
        },
        (error) => {
          this.authService.refreshToken().subscribe(
            (data) => {
              console.log("vào đây")
              resolve(this.canPassGuardAccessToken(data));
            },
            (error) => {
              console.log("Vao đây rồi bắt đầu check logout")
              resolve(this.unauthorizedGuard());
            }
          );
        }
      );
    });
  }

  canPassGuardAccessToken(data) {
    return new Promise<boolean>((resolve, reject) => {
      if (data && data.access_token) {
        this.authService.saveNewUserMe(data);
        const lstAppCode: string[] = data['user']['customData']['jee-account']['appCode'];
        console.log("lstAppCode",lstAppCode)
        if (lstAppCode) {
          if (lstAppCode.indexOf(this.appCode) === -1) {
            return resolve(this.unAppCodeAuthorizedGuard());
          } else {
            return resolve(true);
          }
        } else {
          return resolve(this.unAppCodeAuthorizedGuard());
        }
        return resolve(true);
      }
    });
  }

  unauthorizedGuard() {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.logout();
      return resolve(false);
    });
  }

  unAppCodeAuthorizedGuard() {
    return new Promise<boolean>((resolve, reject) => {
      const popup = this.layoutUtilsService.showActionNotification(
        'Bạn không có quyền truy cập trang này',
        MessageType.Read,
        999999999,
        true,
        false,
        3000,
        'top',
        0
      );
      this.authService.logoutToSSO().subscribe(() => {
        popup.afterDismissed().subscribe((res) => {
          window.open(this.HOST_JEELANDINGPAGE);
          return resolve(false);
        });
      });
      return resolve(false);
    });
  }
}