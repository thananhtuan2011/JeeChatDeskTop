import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {ToastrModule} from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FileUploadModule} from 'ng2-file-upload';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Select2Module } from "ng-select2-component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {IvyGalleryModule} from 'angular-gallery';
import { CommonModule } from '@angular/common';
import { ModuleModule } from './ChatAppModule/-module.module';
import { AuthService } from './auth/_services/auth.service';
import { AuthGuard } from './auth/_services/auth.guard';
import { SplashScreenModule } from './pages/splash-screen/splash-screen.module';


function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
 
  
  
  
 
   
  
  ],
  imports: [
  
    SplashScreenModule,
    ModuleModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Select2Module,
    InfiniteScrollModule,
    IvyGalleryModule,
    TimeagoModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
