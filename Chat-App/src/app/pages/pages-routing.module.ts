import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_services/auth.guard';
import { LayoutComponent } from './_layout/layout/layout.component';
const routes: Routes = [
 
      
  {
    path: '',
    component: LayoutComponent,
    
    children: [
     
    
      // {
      //   path: '',
      //   loadChildren: () =>
      //   import('../ChatAppModule/-module/-module.module').then((m) => m.ModuleModule),
      // },
     

    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
