import { Result } from 'src/app/directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from './../../directives/navbar/navbar.component';
import { AuthService } from './../../directives/auth/auth.service';
import { User } from './../../directives/interfaces';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = {
    userName: '',
    userPwd: '',
    userId: '',
    privileges: null
  };
  errors = { login: undefined };
  submitted = false;
  Router;
  AuthService;
  NavbarComponent;
  name = new FormControl('', [Validators.required]);
  pwd = new FormControl('', [Validators.required]);

  constructor(public authService: AuthService, router: Router, public client: HttpClient, navbarComponent: NavbarComponent) {
    this.Router = router;
    this.AuthService = authService;
    this.NavbarComponent = navbarComponent;
  }

  register() {
    this.Router.navigateByUrl('/register');
  }

  login() {
    const name = this.user.userName;
    const password = this.user.userPwd;
    const body = JSON.stringify({
      userName: name,
      userPwd: password
    });
    this.client.post<Result<User>>('http://localhost:9000/users/login', body, {
      observe: 'response',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).subscribe(
      res => {
        if (res.body.success === false) {
          this.errors.login = res.body.error;
          return;
        }
        localStorage.setItem('id_token', res.body.token);
        console.log(res);
        this.AuthService.login(res.body.data);
        this.AuthService.isLoggedIn().then(
          is => console.log(is)
        );
        this.NavbarComponent.reset();
        this.Router.navigateByUrl('/main');
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
    );
  }

  ngOnInit() {
  }

}
