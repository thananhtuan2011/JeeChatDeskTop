"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("src/environments/environment");
var http_1 = require("@angular/common/http");
var jwt_decode_1 = require("jwt-decode");
var electron = window.require('electron');
var redirectUrl = environment_1.environment.HOST_REDIRECTURL + '/?redirectUrl=';
var DOMAIN = environment_1.environment.DOMAIN_COOKIES;
var API_IDENTITY = "" + environment_1.environment.HOST_IDENTITYSERVER_API;
var API_IDENTITY_LOGOUT = API_IDENTITY + "/user/logout";
var API_IDENTITY_USER = API_IDENTITY + "/user/me";
var API_IDENTITY_REFESHTOKEN = API_IDENTITY + "/user/refresh";
var KEY_SSO_TOKEN = 'sso_token';
var KEY_RESRESH_TOKEN = 'sso_token_refresh';
var API_IDENTITY_LOGIN = API_IDENTITY + "/user/login";
var AuthService = /** @class */ (function () {
    function AuthService(http, router, authHttpService, cookieService) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.authHttpService = authHttpService;
        this.cookieService = cookieService;
        // private fields
        this.unsubscribe = [];
        this.currentUserSubject = new rxjs_1.BehaviorSubject(undefined);
        this.authSSOModelSubject$ = new rxjs_1.BehaviorSubject(undefined);
        // Private fields
        this.isLoading$ = new rxjs_1.BehaviorSubject(false);
        this.isFirstLoading$ = new rxjs_1.BehaviorSubject(true);
        this.errorMessage = new rxjs_1.BehaviorSubject(undefined);
        this.subscriptions = [];
        this.userSubject = new rxjs_1.BehaviorSubject(null);
        this.User$ = this.userSubject.asObservable();
        this.isLoading$ = new rxjs_1.BehaviorSubject(false);
        if (this.getAccessToken_cookie()) {
            this.getUserMeFromSSO().subscribe(function (data) {
                if (data && data.access_token) {
                    _this.userSubject.next(data);
                    _this.saveToken_cookie(data.access_token, data.refresh_token);
                }
            }, function (error) {
                _this.refreshToken().subscribe(function (data) {
                    if (data && data.access_token) {
                        _this.userSubject.next(data);
                        _this.saveToken_cookie(data.access_token, data.refresh_token);
                    }
                }, function (error) {
                    _this.logout();
                });
            }, function () {
                setInterval(function () {
                    if (!_this.getAccessToken_cookie() && !_this.getRefreshToken_cookie())
                        _this.prepareLogout();
                }, 2000);
            });
        }
        setInterval(function () { return _this.autoGetUserFromSSO(); }, 60000);
    }
    Object.defineProperty(AuthService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        set: function (user) {
            this.currentUserSubject.next(user);
        },
        enumerable: false,
        configurable: true
    });
    AuthService.prototype.getHttpHeaders = function () {
        // console.log('auth.token',auth.access_token)
        var result = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return result;
    };
    AuthService.prototype.login = function (data) {
        var httpHeader = this.getHttpHeaders();
        return this.http.post(API_IDENTITY_LOGIN, data, { headers: httpHeader });
    };
    AuthService.prototype.handleError = function (operation, result) {
        if (operation === void 0) { operation = 'operation'; }
        return function (error) {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // Let the app keep running by returning an empty result.
            return rxjs_1.of(result);
        };
    };
    AuthService.prototype.getUserId = function () {
        var auth = this.getAuthFromLocalStorage();
        return auth.user.customData['jee-account'].userID;
    };
    AuthService.prototype.getAccessToken_cookie = function () {
        var dl;
        var cookies = this.getCookie({ name: 'token' });
        if (cookies[0].value !== "") {
            dl = JSON.parse(cookies[0].value);
            if (dl.access_token) {
                var access_token = dl.access_token;
                return access_token;
            }
        }
    };
    AuthService.prototype.saveToken_cookie = function (access_token, refresh_token) {
        var data = {
            access_token: access_token,
            refresh_token: refresh_token
        };
        this.setCookie({ url: 'https://github.com', name: 'token', value: JSON.stringify(data), expirationDate: 9999999999 });
    };
    AuthService.prototype.getRefreshToken_cookie = function () {
        var refresh_token;
        var dl;
        var cookies = this.getCookie({ name: 'token' });
        if (cookies && cookies[0].value !== "") {
            dl = JSON.parse(cookies[0].value);
            refresh_token = dl.refresh_token;
        }
        var sso_token = refresh_token;
        return sso_token;
    };
    AuthService.prototype.deleteAccessRefreshToken_cookie = function () {
        this.setCookie({ url: 'https://github.com', name: 'token', value: "", expirationDate: 9999999999 });
    };
    AuthService.prototype.autoGetUserFromSSO = function () {
        var auth = this.getAuthFromLocalStorage();
        if (auth) {
            this.saveNewUserMe();
        }
    };
    AuthService.prototype.saveNewUserMe = function (data) {
        var _this = this;
        if (data) {
            this.userSubject.next(data);
            this.saveToken_cookie(data.access_token, data.refresh_token);
        }
        this.getUserMeFromSSO().subscribe(function (data) {
            if (data && data.access_token) {
                _this.userSubject.next(data);
                _this.saveToken_cookie(data.access_token, data.refresh_token);
            }
        }, function (error) {
            _this.refreshToken().subscribe(function (data) {
                if (data && data.access_token) {
                    _this.userSubject.next(data);
                    _this.saveToken_cookie(data.access_token, data.refresh_token);
                }
            }, function (error) {
                _this.logout();
            });
        });
    };
    AuthService.prototype.setCookie = function (cookie) {
        return electron.ipcRenderer.sendSync('set-cookie-sync', cookie);
    };
    AuthService.prototype.getCookie = function (filter) {
        return electron.ipcRenderer.sendSync('get-cookie-sync', filter);
    };
    AuthService.prototype.isAuthenticated = function () {
        var cookies = this.getCookie({ name: 'token' });
        console.log("isAuthenticated", cookies);
        if (cookies && cookies[0].value !== "") {
            var dl = JSON.parse(cookies[0].value);
            var access_token = dl.access_token;
            var refresh_token = dl.refresh_token;
            console.log("refresh_token", access_token);
            if (access_token) {
                if (this.isTokenExpired(access_token)) {
                    this.saveToken_cookie(access_token);
                    return true;
                }
            }
            if (refresh_token) {
                if (this.isTokenExpired(refresh_token)) {
                    this.saveToken_cookie(undefined, refresh_token);
                    return true;
                }
            }
            return false;
        }
    };
    AuthService.prototype.isTokenExpired = function (token) {
        var date = this.getTokenExpirationDate(token);
        if (!date)
            return false;
        return date.valueOf() > new Date().valueOf();
    };
    AuthService.prototype.getTokenExpirationDate = function (auth) {
        var decoded = jwt_decode_1["default"](auth);
        if (!decoded.exp)
            return null;
        var date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    AuthService.prototype.LogOutOs = function () {
        var host = "https://portal.jee.vn";
        var iframeSource = host + "/?logout=true";
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', iframeSource);
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        window.addEventListener('message', function () {
            window.location.reload();
        }, false);
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        console.log("Vào logout");
        this.deleteAccessRefreshToken_cookie();
        this.LogOutOs();
        var access_token = this.getAccessToken_cookie();
        if (access_token) {
            this.logoutToSSO().subscribe(function (res) {
                _this.prepareLogout();
            }, function (err) {
                _this.prepareLogout();
            });
        }
        else {
            this.prepareLogout();
        }
    };
    AuthService.prototype.prepareLogout = function () {
        console.log("Chạy vào prepare logout");
        // window.open('https://portal.jee.vn/sso', '_blank', 'chrome=yes,centerscreen,width=600,height=800,top=400,left=600,resizeable');
        this.router.navigateByUrl('/login');
        // let url = '';
        // if (document.location.port) {
        //   url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port;
        // } else {
        //   url = redirectUrl + document.location.protocol + '//' + document.location.hostname;
        // }
        // window.location.href = url;
    };
    AuthService.prototype.getParamsSSO = function () {
        var url = window.location.href;
        var paramValue = undefined;
        if (url.includes('?')) {
            var httpParams = new http_1.HttpParams({ fromString: url.split('?')[1] });
            paramValue = httpParams.get('sso_token');
        }
        console.log("sso_token", paramValue);
        return paramValue;
    };
    AuthService.prototype.getAuthFromLocalStorage = function () {
        return this.userSubject.value;
    };
    AuthService.prototype.ngOnDestroy = function () {
        this.unsubscribe.forEach(function (sb) { return sb.unsubscribe(); });
    };
    // call api identity server
    AuthService.prototype.getUserMeFromSSO = function () {
        var dl;
        var token;
        var cookies = this.getCookie({ name: 'token' });
        if (cookies && cookies[0].value !== "") {
            dl = JSON.parse(cookies[0].value);
            token = dl.access_token;
        }
        // console.log("tokengetUserMeFromSSO",token)
        var access_token = token;
        var url = API_IDENTITY_USER;
        var httpHeader = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: "Bearer " + access_token
        });
        return this.http.get(url, { headers: httpHeader });
    };
    AuthService.prototype.refreshToken = function () {
        var dl;
        var refreshtoken;
        var cookies = this.getCookie({ name: 'token' });
        if (cookies && cookies[0].value !== "") {
            dl = JSON.parse(cookies[0].value);
            refreshtoken = dl.refresh_token;
        }
        var refresh_token = refreshtoken;
        var url = API_IDENTITY_REFESHTOKEN;
        var httpHeader = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: "Bearer " + refresh_token
        });
        return this.http.post(url, null, { headers: httpHeader });
    };
    AuthService.prototype.logoutToSSO = function () {
        var access_token = this.getAccessToken_cookie();
        var url = API_IDENTITY_LOGOUT;
        var httpHeader = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: "Bearer " + access_token
        });
        return this.http.post(url, null, { headers: httpHeader });
    };
    // end call api identity server
    // method metronic call
    AuthService.prototype.getUserByToken = function () {
        var _this = this;
        var auth = this.getAuthFromLocalStorage();
        if (!auth || !auth.accessToken) {
            return rxjs_1.of(undefined);
        }
        this.isLoading$.next(true);
        return this.authHttpService.getUserByToken(auth.accessToken).pipe(operators_1.map(function (user) {
            if (user) {
                _this.currentUserSubject = new rxjs_1.BehaviorSubject(user);
            }
            else {
                _this.logout();
            }
            return user;
        }), operators_1.finalize(function () { return _this.isLoading$.next(false); }));
    };
    AuthService.prototype.forgotPassword = function (value) {
        throw new Error('Method not implemented.');
    };
    AuthService.prototype.registration = function (newUser) {
        throw new Error('Method not implemented.');
    };
    AuthService.prototype.getStaffId = function () {
        var auth = this.getAuthFromLocalStorage();
        return auth.user.customData['jee-account'].staffID;
    };
    AuthService.prototype.getAppCodeId = function () {
        var auth = this.getAuthFromLocalStorage();
        return auth.user.customData['jee-account'].appCode;
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
