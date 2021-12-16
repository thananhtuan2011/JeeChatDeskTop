import { ChatService } from './../services/chat.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ZoomConfigComponent } from './component/JeeMetting/zoom-config/zoom-config.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DeleteEntityDialogComponent } from '../crud/delete-entity-dialog/delete-entity-dialog.component';
import { LayoutUtilsService } from '../crud/utils/layout-utils.service';
import { ActionNotificationComponent } from '../crud/action-natification/action-notification.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { ModuleRoutingModule } from './-module-routing.module';
import { PageChatComponent } from './component/page-chat/page-chat.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Select2Module } from 'ng-select2-component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IvyGalleryModule } from 'angular-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { HomeComponent } from './component/home/home.component';
import {MatButtonModule} from '@angular/material/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateConvesationGroupComponent } from './component/create-convesation-group/create-convesation-group.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { MyChatComponent } from './component/my-chat/my-chat.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailMyChatComponent } from './component/my-chat/detail-my-chat/detail-my-chat.component';
import { CreateConversationUserComponent } from './component/create-conversation-user/create-conversation-user.component';
import { SliderMessageComponent } from './component/my-chat/slider-message/slider-message.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ThanhVienGroupComponent } from './component/my-chat/thanh-vien-group/thanh-vien-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { InsertThanhvienComponent } from './component/insert-thanhvien/insert-thanhvien.component';
import { EditGroupNameComponent } from './component/edit-group-name/edit-group-name.component';
import { NotificationComponent } from './component/notification/notification.component';
import { SocketioService } from '../services/socketio.service';
import { NotifyServices } from '../services/notify.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FilterPipe } from './pipes/filter.pipe';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { InlineSVGModule } from 'ng-inline-svg';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TimeLastPipe } from './pipes/time-lastmess.pipe';
import { MenuServices } from '../services/menu.service';
import { PopoverModule } from 'ngx-smart-popover';
import { DisplayDateTimeFormatPipe } from './pipes/DisplayDateformat.pipe';
import { QuillModule } from 'ngx-quill';
import {MatExpansionModule} from '@angular/material/expansion';
import { ShareMessageComponent } from './component/my-chat/share-message/share-message.component';
import { CallVideoComponent } from './component/call-video/call-video.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DangKyCuocHopPageComponent } from './component/JeeMetting/dang-ky-cuoc-hop-page/dang-ky-cuoc-hop-page.component';
import { GoogleConfigComponent } from './component/JeeMetting/google-config/google-config.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DangKyCuocHopService } from '../services/dang-ky-cuoc-hop.service';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AvatarUserComponent } from './component/JeeMetting/jee-choose-member/avatar-user/avatar-user.component';
import { JeeChooseMemberComponent } from './component/JeeMetting/jee-choose-member/jee-choose-member.component';
import { JeeMeetingService } from '../services/jee-meeting.service';
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [
    LoginComponent,
    JeeChooseMemberComponent,
    ZoomConfigComponent,
    GoogleConfigComponent,
    DangKyCuocHopPageComponent,
    DisplayDateTimeFormatPipe,
    TimeAgoPipe,
    TimeLastPipe,
    DateTimeFormatPipe,
    InsertThanhvienComponent,
    DeleteEntityDialogComponent,
    ThanhVienGroupComponent,
    ActionNotificationComponent,
    SliderMessageComponent,
    FilterPipe,
    DetailMyChatComponent,
    MyChatComponent,
    CreateConversationUserComponent,
    CreateConvesationGroupComponent,
    HomeComponent,
    PageChatComponent,
    NotFoundComponent,
    ServerErrorComponent,
    ChatBoxComponent,
    EditGroupNameComponent,
    NotificationComponent,
    ShareMessageComponent,
    CallVideoComponent,
    UserProfileComponent,
    AvatarUserComponent,
  ],
  entryComponents: [CreateConvesationGroupComponent,CreateConversationUserComponent,
    EditGroupNameComponent,ShareMessageComponent,CallVideoComponent,
    DangKyCuocHopPageComponent,
    ZoomConfigComponent,
    GoogleConfigComponent,
    JeeChooseMemberComponent,
    ActionNotificationComponent,ThanhVienGroupComponent,DeleteEntityDialogComponent,InsertThanhvienComponent
  ],
  imports: [
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatSidenavModule,
     QuillModule.forRoot(),
    CKEditorModule,
    PopoverModule,
    LightboxModule,
    GalleryModule,
    PickerModule,
    TranslateModule.forRoot(),
    MatMenuModule,
    NgbModule,
    RouterModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AvatarModule,
    ScrollingModule,
    MatIconModule,
    FormsModule,
    InlineSVGModule,
    MatTabsModule,
    NgbTooltipModule,
    NgxAutoScrollModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    PerfectScrollbarModule,
    MatButtonModule,
    ScrollingModule,
    MatIconModule,
    CommonModule,
    BrowserModule,
    ModuleRoutingModule,
    NgxSpinnerModule,
    FileUploadModule,
    ReactiveFormsModule,
    HttpClientModule,
    Select2Module,
    InfiniteScrollModule,
    IvyGalleryModule,
    TimeagoModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatSnackBarModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    LayoutUtilsService,
    SocketioService,
    NotifyServices,
    MenuServices,
    DangKyCuocHopService,
    JeeMeetingService,
    ChatService,

  ],
  exports: [
    MatSidenavModule,
    MatExpansionModule
  ],
})
export class ModuleModule { }
