import { MatBadgeModule } from '@angular/material/badge';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './_layout/layout/layout.component';

@NgModule({
  declarations: [
  
  
    LayoutComponent
  ],

  imports: [
    
    MatBadgeModule,
    CommonModule,
    PagesRoutingModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule 
  ],
})
export class LayoutModule { }
