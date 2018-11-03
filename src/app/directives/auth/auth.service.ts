// @flow
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { safeCb } from '../util';
import { Result, User, UserPrivileges } from './../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static parameters = [HttpClient];
  _currentUser: User = {
    userName: '',
    userPwd: '',
    userId: '',
    privileges: null
  };
  @Output() currentUserChanged = new EventEmitter(true);
  HttpClient;

  constructor(http: HttpClient) {
    this.HttpClient = http;
    if (localStorage.getItem('id_token')) {
      http.get<Result<User>>('http://localhost:9000/users/me', {
        observe: 'response',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }).subscribe(
        res => {
          if (res.body.success === false) {
            console.log(res.body.error);
            throw res.body.error;
          }
          this.currentUser = res.body.data;
        },
        error => {
          console.log(error);
          localStorage.removeItem('id_token');
        });
    }
  }

  static hasPrivilege(userPrivileges: UserPrivileges, privilege: string) {
    switch (privilege) {
      case 'canGetMonitor':
        return userPrivileges.canGetMonitor;
      case 'canModifyDisplay':
        return userPrivileges.canModifyDisplay;
      case 'canModifyUser':
        return userPrivileges.canModifyUser;
      case 'canDownloadReport':
        return userPrivileges.canDownloadReport;
      case 'canViewHistory':
        return userPrivileges.canViewHistory;
    }
  }
  canGetMonitor(callback?) {
    return this.getCurrentUser().then(user => {
      const is = user.privileges.canGetMonitor === true;
      safeCb(callback)(is);
      return is;
    });
  }
  canModifyDisplay(callback?) {
    return this.getCurrentUser().then(user => {
      const is = user.privileges.canModifyDisplay === true;
      safeCb(callback)(is);
      return is;
    });
  }
  canModifyUser(callback?) {
    return this.getCurrentUser().then(user => {
      const is = user.privileges.canModifyUser === true;
      safeCb(callback)(is);
      return is;
    });
  }
  canDownloadReport(callback?) {
    return this.getCurrentUser().then(user => {
      const is = user.privileges.canDownloadReport === true;
      safeCb(callback)(is);
      return is;
    });
  }
  canViewHistory(callback?) {
    return this.getCurrentUser().then(user => {
      const is = user.privileges.canViewHistory === true;
      safeCb(callback)(is);
      return is;
    });
  }

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(user) {
    this._currentUser = user;
    this.currentUserChanged.emit(user);
  }

  public login(user: User) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  public logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('id_token');
    this.currentUser = {
      userName: '',
      userPwd: '',
      userId: '',
      privileges: null
    };
    return Promise.resolve();
  }

  getCurrentUser(callback?) {
    safeCb(callback)(this.currentUser);
    return Promise.resolve(this.currentUser);
  }

  getCurrentUserSync() {
    return this.currentUser;
  }

  isLoggedIn(callback?) {
    const is = !!this.currentUser.userId;
    safeCb(callback)(is);
    return Promise.resolve(is);
  }

  isLoggedInSync() {
    return !!this.currentUser.userId;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }
}
