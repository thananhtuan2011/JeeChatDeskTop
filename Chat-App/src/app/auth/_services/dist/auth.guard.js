"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthGuard = void 0;
var layout_utils_service_1 = require("./../../crud/utils/layout-utils.service");
var environment_1 = require("./../../../environments/environment");
var core_1 = require("@angular/core");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router, layoutUtilsService) {
        this.authService = authService;
        this.router = router;
        this.layoutUtilsService = layoutUtilsService;
        this.appCode = environment_1.environment.APPCODE;
        this.HOST_JEELANDINGPAGE = environment_1.environment.HOST_JEELANDINGPAGE;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // console.log("accTibe",this.authService.isAuthenticated())
            // console.log("Data token nè",this.authService.getParamsSSO())
            //   var cookie=this.authService.getCookie()
            // console.log('inside showCookie',cookie)
            if (!_this.authService.isAuthenticated()) {
                // if (this.authService.getParamsSSO()) {
                //   this.authService.saveToken_cookie(this.authService.getParamsSSO());
                // }
                var cookies = _this.authService.getCookie({ name: 'token' });
                // console.log("cookies", cookies);
                if (cookies && cookies[0].value !== "") {
                    var dl = JSON.parse(cookies[0].value);
                    // console.log("access_token",dl['access_token'])
                    if (dl.access_token) {
                        var access_token = dl.access_token;
                        console.log("access_token", access_token);
                        resolve(_this.canPassGuard());
                        //  resolve(true);
                    }
                    else {
                        // console.log("vậy là vào đây rồi")
                        // resolve(true);
                        resolve(_this.canPassGuard());
                    }
                }
                else {
                    // console.log("VVVVVV")
                    resolve(_this.canPassGuard());
                }
            }
            else {
                resolve(_this.canPassGuard());
            }
        });
    };
    AuthGuard.prototype.canPassGuard = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.authService.getUserMeFromSSO().subscribe(function (data) {
                resolve(_this.canPassGuardAccessToken(data));
            }, function (error) {
                _this.authService.refreshToken().subscribe(function (data) {
                    console.log("vào đây");
                    resolve(_this.canPassGuardAccessToken(data));
                }, function (error) {
                    console.log("Vao đây rồi bắt đầu check logout");
                    resolve(_this.unauthorizedGuard());
                });
            });
        });
    };
    AuthGuard.prototype.canPassGuardAccessToken = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (data && data.access_token) {
                _this.authService.saveNewUserMe(data);
                var lstAppCode = data['user']['customData']['jee-account']['appCode'];
                console.log("lstAppCode", lstAppCode);
                if (lstAppCode) {
                    if (lstAppCode.indexOf(_this.appCode) === -1) {
                        return resolve(_this.unAppCodeAuthorizedGuard());
                    }
                    else {
                        return resolve(true);
                    }
                }
                else {
                    return resolve(_this.unAppCodeAuthorizedGuard());
                }
                return resolve(true);
            }
        });
    };
    AuthGuard.prototype.unauthorizedGuard = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.authService.logout();
            return resolve(false);
        });
    };
    AuthGuard.prototype.unAppCodeAuthorizedGuard = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var popup = _this.layoutUtilsService.showActionNotification('Bạn không có quyền truy cập trang này', layout_utils_service_1.MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            _this.authService.logoutToSSO().subscribe(function () {
                popup.afterDismissed().subscribe(function (res) {
                    window.open(_this.HOST_JEELANDINGPAGE);
                    return resolve(false);
                });
            });
            return resolve(false);
        });
    };
    AuthGuard = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
