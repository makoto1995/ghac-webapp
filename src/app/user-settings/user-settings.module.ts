import { AuthService } from './../directives/auth/auth.service';
import { DirectivesModule } from './../directives/directives.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialModule } from './../directives/material.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../directives/navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


const userRoutes: Routes = [];

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forChild(userRoutes),
    DirectivesModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    NavbarComponent
  ],
  declarations: [UserSettingsComponent, LoginComponent, SignupComponent]
})
export class UserSettingsModule { }
