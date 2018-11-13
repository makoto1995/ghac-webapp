import { Result } from 'src/app/directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../directives/auth/auth.service';
import { User } from './../../directives/interfaces';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  static parameters = [AuthService, Router, HttpClient];
  user: User = {
    userName: '',
    userPwd: '',
    userId: '',
    privileges: {
      canGetMonitor: false,
      canDownloadReport: false,
      canModifyDisplay: false,
      canModifyUser: false,
      canViewHistory: false
    }
  };
  confirmPassword;
  errors = {};
  submitted = false;
  AuthService;
  Router;

  constructor(_AuthService: AuthService, _Router: Router, public client: HttpClient) {
    this.AuthService = _AuthService;
    this.Router = _Router;
  }

  register() {
    this.submitted = true;
    this.client.post<Result<User>>('http://localhost:9000/users/', JSON.stringify(this.user), {
      observe: 'response',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).subscribe(
      res => {
        console.log(res.body);
        if (res.body.success === false) {
          this.errors = { serverSide: '注册失败!' };
          return;
        }
        localStorage.setItem('id_token', res.body.token);
        this.AuthService.login(res.body.data);
        this.Router.navigateByUrl('/main');
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
    );
  }

}
