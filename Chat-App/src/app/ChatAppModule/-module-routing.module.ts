import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_services/auth.guard';
import { DetailMyChatComponent } from './component/my-chat/detail-my-chat/detail-my-chat.component';
import { MyChatComponent } from './component/my-chat/my-chat.component';
import { SliderMessageComponent } from './component/my-chat/slider-message/slider-message.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [

{path: 'Chat', component: MyChatComponent,
canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component:SliderMessageComponent,

      },
      {
        path: 'Messages/:id/:idchat',
        component: DetailMyChatComponent,
      },
      // {
      //   path: 'Messages/Detail/:id/:idchat',
      //   component: DetailMyChatComponent,
      // },
      // {
      //   path: '',
      //   redirectTo: '/Home',
      //   pathMatch: 'full',
      // },
    ]

  },
  {
    path: 'login',
    component: LoginComponent,
    
  },
  // {path: 'detail', component: DetailComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {
    path: '',
    redirectTo: '/Chat',
    pathMatch: 'full',
  },
  {path: '**', component: NotFoundComponent},



];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRoutingModule { }
