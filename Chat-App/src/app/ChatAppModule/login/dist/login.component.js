"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(fb, auth, route, router, electron_services) {
        this.fb = fb;
        this.auth = auth;
        this.route = route;
        this.router = router;
        this.electron_services = electron_services;
        // KeenThemes mock, change it to:
        // defaultAuth = {
        //   email: '',
        //   password: '',
        // };
        this.defaultAuth = {
            username: '',
            password: ''
        };
        // private fields
        this.unsubscribe = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
        // debugger
        // this.isLoading$ = this.authService.isLoading$;
        // // redirect to home if already logged in
        // if (this.authService.currentUserValue) {
        //   this.router.navigate(['/']);
        // }
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.initForm();
        // get return url from route parameters or default to '/'
        // this.returnUrl =
        //     this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () {
            return this.loginForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    LoginComponent.prototype.initForm = function () {
        this.loginForm = this.fb.group({
            username: [
                this.defaultAuth.username,
                forms_1.Validators.compose([
                    forms_1.Validators.required,
                    // Validators.email,
                    forms_1.Validators.minLength(3),
                    forms_1.Validators.maxLength(320),
                ]),
            ],
            password: [
                this.defaultAuth.password,
                forms_1.Validators.compose([
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(3),
                    forms_1.Validators.maxLength(100),
                ]),
            ]
        });
    };
    LoginComponent.prototype.submit = function () {
        var _this = this;
        var authData = {
            username: this.loginForm.value['username'],
            password: this.loginForm.value['password']
        };
        this.auth.login(authData)
            // .pipe(
            // 	tap(({access_token}) => {
            // 	  this.authJwtService.storeAuthenticationToken(
            // 		access_token,
            // 		true
            // 	  );
            // 	}),
            //   )
            .subscribe({
            next: function (data) {
                console.log('Login', data);
                var result = _this.auth.setCookie({ url: 'https://github.com', name: 'token', value: JSON.stringify(data), expirationDate: 9999999999 });
                if (result)
                    console.log('data saved', result);
                //  var cookie=this.auth.getCookie()
                //  console.log('inside showCookie',cookie)
                // this.electron_services.setCookie(value)
                // console.log("Token",this.electron_services.getCookie())
                _this.router.navigate(['/Chat']);
            },
            error: function (err) {
                var errorMsg = err.error.detail;
                errorMsg =
                    errorMsg ||
                        console.log(err);
            }
        });
    };
    LoginComponent.prototype.Show = function () {
        var cookie = this.auth.getCookie({ name: 'token' });
        console.log('inside showCookie', cookie);
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe.forEach(function (sb) { return sb.unsubscribe(); });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
