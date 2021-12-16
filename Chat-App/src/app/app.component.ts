import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable, Observer, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from './i18n/translation.service';
import { SplashScreenService } from './pages/splash-screen/splash-screen.service';
import { PresenceService } from './services/presence.service';
import { locale as enLang } from './i18n/vocabs/en';

import { locale as viLang } from './i18n/vocabs/vi';
// import { AccountService } from './ChatAppModule/services/account.service';
// import { PresenceService } from './ChatAppModule/services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'CHAT-APP';
  loading = false;
  private unsubscribe: Subscription[] = [];
  constructor(   private splashScreenService: SplashScreenService,
    private router: Router,private presence: PresenceService,
    private translationService: TranslationService,){

      this.translationService.loadTranslations(
        viLang,
        enLang,
  
       
      );
    };  

  ngOnInit(): void {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 1000);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

 
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(e) {
  //   if (!this.checkDataBeforeClose()) {
  //     e.preventDefault(); //for Firefox
  //     return e.returnValue = ''; //for Chorme
  //   }
  // }

// @HostListener('window:beforeunload', ['$event'])
// beforeUnloadHander(event) {
 
//     this.presence.disconnectToken();
 
//     return true;
// }
}
