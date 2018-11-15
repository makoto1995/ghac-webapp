// @flow
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../directives/auth/auth.service';
import { Result, User } from './../../directives/interfaces';
import { ConfirmPwdErrorStateMatcher } from './../../directives/util';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  static parameters = [AuthService, HttpClient, Router, FormBuilder];
  currentUser: User;
  errors = { other: undefined };
  message = '';
  submitted = false;
  AuthService: AuthService;
  Router;
  oldPassword;
  newPassword;
  confirmPassword;
  changePasswordForm: FormGroup;
  matcher = new ConfirmPwdErrorStateMatcher();

  checkPassword(group: FormGroup) {
    const pwd = group.controls.pwd.value;
    const confirmPwd = group.controls.confirmPwd.value;
    return pwd === confirmPwd ? null : {
      notSame: true,
    };
  }

  constructor(_authService: AuthService, public client: HttpClient, _router: Router, public fb: FormBuilder) {
    this.AuthService = _authService;
    this.Router = _router;
    this.currentUser = this.AuthService.currentUser;
    this.changePasswordForm = this.fb.group({
      oldPwd: ['', {
        validators: Validators.required,
        updateOn: 'blur'
      }],
      pwd: ['', {
        validators: Validators.required,
        updateOn: 'blur'
      }],
      confirmPwd: ['']
    }, {
        validator: this.checkPassword
    });
  }

  changePassword() {
    this.client.post<Result<User>>('http://127.0.0.1:9000', {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }, {
      observe: 'response',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).subscribe(
      res => {
        if (res.body.success === false) {
          this.errors.other = '密码不正确';
          console.log(res.body.data);
          return;
        }
        this.message = '密码更改成功';
        this.Router.navigateByUrl('/main');
      }
    );
  }

}
