import { AuthGuard } from './auth/_services/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




export const routes: Routes = [
  // {
  //   path: '',
  //   // canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./ChatAppModule/-module/-module.module').then((m) => m.ModuleModule),
  // },
// {
//     path: '',
//     canActivate: [AuthGuard],
//     loadChildren: () =>
//       import('./pages/layout.module').then((m) => m.LayoutModule),
//   },
  
  // {
   
  //   path: 'auth',
  //   loadChildren: () =>
  //     import('./auth/auth.module').then((m) => m.AuthModule),
  // },


]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
