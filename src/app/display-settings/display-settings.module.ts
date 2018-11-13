import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminConfigureComponent } from './admin-configure/admin-configure.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AdminUserComponent, AdminConfigureComponent]
})
export class DisplaySettingsModule { }
