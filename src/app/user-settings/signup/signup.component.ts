import { Result } from 'src/app/directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../directives/auth/auth.service';
import { User } from './../../directives/interfaces';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class ConfirmPwdErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  static parameters = [AuthService, Router, HttpClient, FormBuilder];
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
  errors = {};
  submitted = false;
  AuthService;
  Router;
  signupForm: FormGroup;
  matcher = new ConfirmPwdErrorStateMatcher();
  // name = new FormControl('', {
  //   validators: Validators.required,
  //   updateOn: 'blur'
  // });
  // pwd = new FormControl('', {
  //   validators: Validators.required,
  //   updateOn: 'blur'
  // });
  confirmPassword;

  checkPassword(group: FormGroup) {
    const pwd = group.controls.pwd.value;
    const confirmPwd = group.controls.confirmPwd.value;
    return pwd === confirmPwd ? null : {
      notSame: true,
    };
  }

  constructor(_AuthService: AuthService, _Router: Router, public client: HttpClient, public fb: FormBuilder) {
    this.AuthService = _AuthService;
    this.Router = _Router;
    this.signupForm = this.fb.group({
      name: ['', {
        validators: Validators.required,
        updateOn: 'blur'
      }],
      pwd: ['', {
        validators: Validators.required,
        updateOn: 'blur'
      }],
      confirmPwd: ['', {
        updateOn: 'blur'
      }]
    }, {
      validator: this.checkPassword
    });
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
