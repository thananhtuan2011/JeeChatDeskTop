"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var en_1 = require("./i18n/vocabs/en");
var vi_1 = require("./i18n/vocabs/vi");
// import { AccountService } from './ChatAppModule/services/account.service';
// import { PresenceService } from './ChatAppModule/services/presence.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(splashScreenService, router, presence, translationService) {
        this.splashScreenService = splashScreenService;
        this.router = router;
        this.presence = presence;
        this.translationService = translationService;
        this.title = 'CHAT-APP';
        this.loading = false;
        this.unsubscribe = [];
        this.translationService.loadTranslations(vi_1.locale, en_1.locale);
    }
    ;
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var routerSubscription = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                // clear filtration paginations and others
                // hide splash screen
                _this.splashScreenService.hide();
                // scroll to top on every route change
                window.scrollTo(0, 0);
                // to display back the body content
                setTimeout(function () {
                    document.body.classList.add('page-loaded');
                }, 1000);
            }
        });
        this.unsubscribe.push(routerSubscription);
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe.forEach(function (sb) { return sb.unsubscribe(); });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
