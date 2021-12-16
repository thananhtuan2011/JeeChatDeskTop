import { AuthService } from './../../auth/_services/auth.service';
import { ElectronIpcService } from './../../services/electron-ipc.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   email: '',
  //   password: '',
  // };
  defaultAuth: any = {
    username:'',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  fail:boolean=false;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private electron_services:ElectronIpcService,
  ) {
    // debugger
    // this.isLoading$ = this.authService.isLoading$;
    // // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    // this.returnUrl =
    //     this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
     }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [
        this.defaultAuth.username,
        Validators.compose([
          Validators.required,
          // Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    try
    {

   
		let authData = {
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
			next: data => {
			   console.log('Login',data);
        
      
         var result=this.auth.setCookie({ url: 'https://github.com', name: 'token',value:JSON.stringify(data), expirationDate: 9999999999 })
         if (result)
           console.log('data saved',result)
        

          //  var cookie=this.auth.getCookie()
          //  console.log('inside showCookie',cookie)
        // this.electron_services.setCookie(value)
        // console.log("Token",this.electron_services.getCookie())
       this.router.navigate(['/Chat']);
		
			  
			 
			},
			error: (err: HttpErrorResponse) => {
			  let errorMsg = err.error.detail;
			  errorMsg =
				errorMsg ||
          
			  console.log(err);
        this.fail=true;
			}
      
		})
  } catch
  {

  }

  }
  Show()
  { 
    var cookie=this.auth.getCookie({ name: 'token' })
     console.log('inside showCookie',cookie)

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
