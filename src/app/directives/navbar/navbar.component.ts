import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { User } from '../interfaces';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  static parameters = [MatIconRegistry, AuthService, Router];
  isCollapsed = true;
  menu = [{
    title: '主监控面板',
    'link': '/main'
  }];
  Router;
  isLoggedIn;
  canGetMonitor: boolean;
  canModifyDisplay: boolean;
  canModifyUser: boolean;
  canDownloadReport: boolean;
  canViewHistory: boolean;
  currentUser: User;
  AuthService;


  constructor(iconRegistry: MatIconRegistry, private authService: AuthService, private router: Router) {
    this.AuthService = authService;
    this.Router = router;
    this.reset();
    this.AuthService.currentUserChanged.subscribe(user => {
      this.currentUser = user;
      this.reset();
    });
  }

  reset() {
    this.AuthService.isLoggedIn().then(is => {
      this.isLoggedIn = is;
    });
    this.AuthService.canGetMonitor().then(is => {
      this.canGetMonitor = is;
    });
    this.AuthService.canModifyUser().then(is => {
      this.canModifyUser = is;
    });
    this.AuthService.canDownloadReport().then(is => {
      this.canDownloadReport = is;
    });
    this.AuthService.canViewHistory().then(is => {
      this.canViewHistory = is;
    });
  }

  logout() {
    const promise = this.AuthService.logout();
    this.Router.navigateByUrl('/login');
    return promise;
  }

}
